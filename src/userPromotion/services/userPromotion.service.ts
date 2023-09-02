import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { UserPromotionEntity } from '../models/userPromotion.entity';
import {
  CreateUserPromotionDto,
  UpdatePromotionDto,
  UpdateUserPromotionDto,
  UserPromotionList,
} from '../models/userPromotion.dto';
import { UsersEntity } from 'src/users/models/users.entity';
import { UserRankEntity } from 'src/userRank/models/userRank.entity';
import { UserRank } from 'src/userRank/models/userRank.dto';
import { RanksService } from 'src/ranks/services/ranks.service';
import { RankDontExistError } from 'src/utility/errorTypes';
import { ServiceOptions } from 'src/utility/generalClasses';

export class UserPromotionService {
  constructor(
    @InjectRepository(UserPromotionEntity)
    private readonly userPromotionRepository: Repository<UserPromotionEntity>,

    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,

    @InjectRepository(UserRankEntity)
    private readonly userRankRepository: Repository<UserRankEntity>,

    private dataSource: DataSource,
    private rankService: RanksService,
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
      options?.transactionManager ||
      this.dataSource.createQueryRunner().manager;

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

    const savedUserPromotion = await this.userPromotionRepository.save(
      newUserPromotion,
    );

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

  async checkAllPromotions() {
    const selectFields = [
      'promotion.discord_id as "discordId"',
      'currentRank.order as "currentRankOrder"',
      'currentRank.number as "currentRankNumber"',
      'currentRank.name as "currentRankName"',
      'currentRank.corps as "currentRankCorps"',
      'newRank.order as "newRankOrder"',
      'newRank.number as "newRankNumber"',
      'newRank.name as "newRankName"',
      'newRank.corps as "newRankCorps"',
    ];

    const usersPromotion = await this.userPromotionRepository
      .createQueryBuilder('promotion')
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
      options?.transactionManager?.queryRunner ||
      this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    const entityManager = queryRunner.manager;

    try {
      const usersToPromotion = await this.checkAllPromotions();
      const allRanks = await this.rankService.getAllRanks();
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
        console.log(promotion.newRankName);

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
          { transactionManager: entityManager },
        );

        promotionList.push({ ...promotion });
      }

      console.log('commit');
      await queryRunner.commitTransaction();
      return promotionList;
    } catch (err) {
      console.log('rollback');
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
}
