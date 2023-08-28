import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository, UpdateResult } from 'typeorm';
import { UserPromotionEntity } from '../models/userPromotion.entity';
import { CreateUserPromotionDto, UpdatePromotionDto, UpdateUserPromotionDto, UserPromotionList } from '../models/userPromotion.dto';
import { UsersEntity } from 'src/users/models/users.entity';
import { UserRankEntity } from 'src/userRank/models/userRank.entity';
import { UserRank } from 'src/userRank/models/userRank.dto';
import { RanksService } from 'src/ranks/services/ranks.service';


export class UserPromotionService {
  constructor(
    @InjectRepository(UserPromotionEntity)
    private readonly userPromotionRepository: Repository<UserPromotionEntity>,

    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,

    @InjectRepository(UserRankEntity)
    private readonly userRankRepository: Repository<UserRankEntity>,

    private rankService: RanksService,
  ) { }

  async getUserPromotion(discordId: string) {
    return await this.userPromotionRepository.findOneBy({ discord_id: discordId });
  }

  async updateUserPromotion(discordId: string, userPromotionDto: UpdatePromotionDto) {
    const update = await this.userPromotionRepository.upsert([{ discord_id: discordId, ...userPromotionDto }], ["discord_id"]);

    return update;
  }

  async createUserPromotion(userPromotionDto: CreateUserPromotionDto) {
    const userRank = await this.userRankRepository.findOne({
      where: {
        discord_id: userPromotionDto.discordId
      }
    })



    const newUserPromotion = this.userPromotionRepository.create({
      ...userPromotionDto,
      discord_id: userPromotionDto.discordId,
      userRank: userRank
    });

    const savedUserPromotion = await this.userPromotionRepository.save(newUserPromotion);

    await this.userRepository.update({ discord_id: userPromotionDto.discordId }, {
      userPromotion: newUserPromotion
    });

    return savedUserPromotion;
  }

  async checkUserPromotion(discordId: string) {
    const userPromotion = await this.userPromotionRepository.findOneBy({ discord_id: discordId });

    let promotionData = {
      canUserPromote: false
    }

    if (userPromotion.ready && !userPromotion.blocked)
      promotionData = { canUserPromote: true }

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

    const usersPromotion = await this.userPromotionRepository.createQueryBuilder('promotion')
      .select(selectFields)
      .where("promotion.ready = true")
      .andWhere("promotion.blocked = false")
      .leftJoin("promotion.userRank", "userRank")
      .leftJoin("userRank.rank", "currentRank")
      .leftJoin("ranks", "newRank", '"currentRank"."order" + 1 = "newRank"."order"')
      .getRawMany();

    return usersPromotion as UserPromotionList[];
  }

  async grantAllPromotions() {
    const usersToPromotion = await this.checkAllPromotions();
    const allRanks = await this.rankService.getAllRanks();
    const promotionList: UserRankEntity[] = [];

    usersToPromotion.forEach(async (promotion) => {
      const newRank = allRanks.find((rank) => rank.order === promotion.newRankOrder);

      const promotionEntity = await this.userRankRepository.createQueryBuilder().update()
        .set({
          rank: newRank,
        })
        .where("discord_id = :discordId", { discordId: promotion.discordId })
        .execute();
    });
  }
}
