import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserPromotionEntity } from '../models/userPromotion.entity';
import {
  CreateUserPromotionDto,
  UpdatePromotionDto,
  UserPromotionList,
} from '../models/userPromotion.dto';
import { UsersEntity } from '../../users/models/users.entity';
import { UserRankEntity } from "../../userRank/models/userRank.entity";
import { RanksService } from '../../ranks/services/ranks.service';
import { RankDontExistError, UserDontExistError } from '../../utility/errorTypes';
import { ServiceOptions } from '../../utility/generalClasses';
import { RecommendationsEntity } from '../../recommendations/models/recommendations.entity';
import { UserRankHistoryService } from '../../userRankHistory/services/userRankHistory.service';
import { Client, GuildMember } from 'discord.js';
import { InjectDiscordClient } from '@discord-nestjs/core';
import { getDiscordGuild, getUserDiscordRoles } from '../../utility/discordUtils';

export class UserPromotionService {
  constructor(
    @InjectRepository(UserPromotionEntity)
    private readonly userPromotionRepository: Repository<UserPromotionEntity>,

    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,

    @InjectRepository(UserRankEntity)
    private readonly userRankRepository: Repository<UserRankEntity>,

    @InjectDiscordClient()
    private readonly client: Client,

    private dataSource: DataSource,
    private rankService: RanksService,
    private userRankHistoryService: UserRankHistoryService,
  ) {}

  async getUserPromotion(discordId: string) {
    return await this.userPromotionRepository.findOneBy({
      discord_id: discordId,
    });
  }

  async updateUserPromotion(
    discordId: string,
    userPromotionDto: UpdatePromotionDto,
    options?: ServiceOptions,
  ) {
    const entityManager =
      options?.entityManager || this.dataSource.createQueryRunner().manager;

    const update = await entityManager.upsert(
      UserPromotionEntity,
      [{ discord_id: discordId, ...userPromotionDto }],
      ['discord_id'],
    );
    return update;
  }

  async createUserPromotion(userPromotionDto: CreateUserPromotionDto) {
    const userRank = await this.userRankRepository.findOne({
      where: {
        discord_id: userPromotionDto.discordId,
      },
    });

    const newUserPromotion = this.userPromotionRepository.create({
      ...userPromotionDto,
      discord_id: userPromotionDto.discordId,
      userRank: userRank,
    });

    const savedUserPromotion =
      await this.userPromotionRepository.save(newUserPromotion);

    await this.userRepository.update(
      { discord_id: userPromotionDto.discordId },
      {
        userPromotion: newUserPromotion,
      },
    );

    return savedUserPromotion;
  }

  async checkUserPromotion(discordId: string) {
    const userPromotion = await this.userPromotionRepository.findOneBy({
      discord_id: discordId,
    });

    let promotionData = {
      canUserPromote: false,
    };

    if (userPromotion.ready && !userPromotion.blocked)
      promotionData = { canUserPromote: true };

    return promotionData;
  }

  async checkAllPromotions(options?: ServiceOptions) {
    const entityManager =
      options?.entityManager || this.dataSource.createQueryRunner().manager;

    const selectFields = [
      'promotion.discord_id as "discordId"',
      'currentRank.id as "currentRankId"',
      'currentRank.order as "currentRankOrder"',
      'currentRank.number as "currentRankNumber"',
      'currentRank.name as "currentRankName"',
      'currentRank.corps as "currentRankCorps"',
      'newRank.id as "newRankId"',
      'newRank.order as "newRankOrder"',
      'newRank.number as "newRankNumber"',
      'newRank.name as "newRankName"',
      'newRank.corps as "newRankCorps"',
    ];

    const usersPromotion = await entityManager
      .createQueryBuilder(UserPromotionEntity, 'promotion')
      .select(selectFields)
      .where('promotion.ready = true')
      .andWhere('promotion.blocked = false')
      .leftJoin('promotion.userRank', 'userRank')
      .leftJoin('userRank.rank', 'currentRank')
      .leftJoin(
        'ranks',
        'newRank',
        '"currentRank"."order" + 1 = "newRank"."order"',
      )
      .getRawMany();

    return usersPromotion as UserPromotionList[];
  }

  async grantAllPromotions(options?: ServiceOptions) {
    const queryRunner =
      options?.entityManager?.queryRunner ||
      this.dataSource.createQueryRunner();

    const entityManager = queryRunner.manager;

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const usersToPromotion = await this.checkAllPromotions({
        entityManager: entityManager,
      });
      const allRanks = await this.rankService.getAllRanks({
        entityManager: entityManager,
      });
      const promotionList: Array<UserPromotionList> = [];

      for (let i = 0; i < usersToPromotion.length; i++) {
        const promotion = usersToPromotion[i];

        if (!promotion.newRankOrder) {
          throw new RankDontExistError();
        }

        const newRank = allRanks.find(
          (rank) => rank.order === promotion.newRankOrder,
        );
        if (!newRank) {
          throw new RankDontExistError(
            `Ranga ${promotion.newRankName} nie istnieje`,
          );
        }

        const userRank = await entityManager.findOneBy(UserRankEntity, {
          discord_id: promotion.discordId,
        });
        userRank.rank = newRank;
        await entityManager.save(userRank);

        await this.updateUserPromotion(
          promotion.discordId,
          {
            blocked: false,
            ready: false,
          },
          { entityManager: entityManager },
        );

        await this.userRankHistoryService.saveUserRankHistory(
          {
            discordId: promotion.discordId,
            promotionRankingId: promotion.currentRankId,
            rankStartDate: userRank.rank_start_date,
          },
          { entityManager },
        );

        await entityManager.delete(RecommendationsEntity, {
          recommended_discord_id: promotion.discordId,
        });

        promotionList.push({ ...promotion });
      }
      await this.promoteDiscordUsers(promotionList);

      await queryRunner.commitTransaction();
      return promotionList;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      if (err instanceof RankDontExistError) {
        throw new RankDontExistError(err.message);
      } else {
        console.error(err);
      }
    } finally {
      await queryRunner.release();
    }
  }

  async promoteDiscordUsers(usersList: UserPromotionList[]) {
    const guild = await getDiscordGuild(this.client);

    for (const userPromotion of usersList) {
      const guildMember = await guild.members.fetch(userPromotion.discordId);

      if (!guildMember)
        throw new UserDontExistError(
          `Nie znaleziono użytkownika na discord <@${userPromotion.discordId}>`,
        );
      const data = await this.promoteUser(guildMember, userPromotion);

      if (!data) {
        throw new Error(
          `Nie udało się nadać ról <@${userPromotion.discordId}>`,
        );
      }
    }
  }

  async promoteUser(user: GuildMember, userPromotion: UserPromotionList) {
    const { newRankName, newRankCorps } = userPromotion;
    const userRoles = getUserDiscordRoles(user);

    const newRankNameRole = user.guild.roles.cache.find(
      (role) => role.name === newRankName,
    );
    const newRankCorpsRole = user.guild.roles.cache.find(
      (role) => role.name === 'Korpus ' + newRankCorps,
    );

    await user.roles.add(newRankNameRole);
    await user.roles.add(newRankCorpsRole);

    await this.removeInvalidRoles(user, userRoles, [
      newRankName,
      'Korpus ' + newRankCorps,
    ]);

    return true;
  }

  async removeInvalidRoles(
    user: GuildMember,
    userRoles: String[],
    validRoles: String[],
  ) {
    for (let userRole of userRoles) {
      if (validRoles.some((validRole) => validRole === userRole)) continue;

      const roleToDelete = user.guild.roles.cache.find(
        (role) => role.name === userRole,
      );

      if (roleToDelete) await user.roles.remove(roleToDelete);
    }
  }
}
