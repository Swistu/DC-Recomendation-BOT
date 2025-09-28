import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { RecommendationsEntity } from '../models/recommendations.entity';
import { UsersEntity } from 'src/users/models/users.entity';
import {
  GiveRecommendationDto,
  RecommendationsAction,
  RecommendationsTypes,
  RemoveRecommendationDto,
} from '../models/recommendations.dto';
import { parseCorpsName } from 'src/utility/parseCorpsName';
import { CorpsTypes, RankTypes } from 'src/ranks/models/ranks.entity';
import {
  RecommendationForbiddenError,
  UserDontExistError,
} from 'src/utility/errorTypes';
import {
  calcCurrentRecommendationNumber,
  checkPromotionAvaiable,
  isUserRecommendationInList,
} from 'src/utility/recommendation.utility';
import { UserPromotionService } from 'src/userPromotion/services/userPromotion.service';
import { ServiceOptions } from 'src/utility/generalClasses';

export class RecommendationsService {
  constructor(
    @InjectRepository(RecommendationsEntity)
    private readonly recommendationsRepository: Repository<RecommendationsEntity>,

    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,

    private dataSource: DataSource,
    private userPromotionSerivce: UserPromotionService,
  ) {}

  async getUserRecommendations(discordId: string, options?: ServiceOptions) {
    const entityManager = options?.entityManager || this.dataSource.manager;

    const userRecommendations = await entityManager.find(
      RecommendationsEntity,
      {
        where: {
          recommendedDiscordId: discordId,
        },
      },
    );

    return userRecommendations;
  }

  async giveUserRecommendation(giveRecommendationDto: GiveRecommendationDto) {
    const { recommendedDiscordId, recommenderDiscordId, reason, type } =
      giveRecommendationDto;
    let newRecommendation: RecommendationsEntity | undefined;
    console.log(giveRecommendationDto);
    if (recommendedDiscordId === recommenderDiscordId)
      throw new RecommendationForbiddenError(
        `Nie możesz dać sobie rekomendacji!`,
      );

    const queryRunner = this.dataSource.createQueryRunner();
    const entityManager = queryRunner.manager;

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const recommenderUser = await entityManager.findOne(UsersEntity, {
        where: {
          discordId: recommenderDiscordId,
        },
        relations: {
          userRank: {
            rank: true,
          },
        },
      });
      if (!recommenderUser) {
        throw new UserDontExistError(
          `Nie znaleziono <@${recommenderDiscordId}> w bazie!`,
        );
      }

      const recommendedUser = await entityManager.findOne(UsersEntity, {
        where: {
          discordId: recommendedDiscordId,
        },
        relations: {
          userRank: {
            rank: true,
          },
          userPromotion: true,
          recommendationsRecived: true,
        },
      });
      if (!recommendedUser)
        throw new UserDontExistError(
          `Nie znaleziono <@${recommendedDiscordId}> w bazie!`,
        );

      if (recommendedUser.userPromotion.ready && type)
        throw new RecommendationForbiddenError(
          `<@${recommendedUser.discordId}> już ma awans!`,
        );

      if (
        isUserRecommendationInList(
          recommenderUser.discordId,
          recommendedUser.recommendationsRecived,
          type.toString(),
        )
      )
        throw new RecommendationForbiddenError(
          'Już dałeś rekomendację graczowi',
        );

      const recommenderCorpsNumber = parseCorpsName(
        recommenderUser.userRank.rank.corps,
      );
      const recommendedCorpsNumber = parseCorpsName(
        recommendedUser.userRank.rank.corps,
      );

      if (recommenderUser.userRank.rank.name !== RankTypes.PULKOWNIK) {
        if (type === RecommendationsTypes.negative) {
          throw new RecommendationForbiddenError(
            'Nie możesz dawać ujemnych rekomendacji!',
          );
        }
        if (recommenderCorpsNumber > recommendedCorpsNumber) {
          if (
            recommenderUser.userRank.rank.corps === CorpsTypes.PODOFICEROW &&
            recommendedUser.userRank.rank.name === RankTypes.PLUTONOWY
          ) {
            throw new RecommendationForbiddenError(
              `Masz za niski stopień, aby dać rekomendacje graczowi <@${recommendedUser.discordId}>!`,
            );
          }
        } else {
          throw new RecommendationForbiddenError();
        }
      }

      await this.checkPromotion(
        recommendedUser,
        type,
        RecommendationsAction.add,
        { entityManager },
      );

      newRecommendation = entityManager.create(RecommendationsEntity, {
        reason: reason,
        type: type.toString(),
        recommendedDiscordId: recommendedDiscordId,
        recommenderDiscordId: recommenderDiscordId,
      });

      await entityManager.save(newRecommendation);
      await queryRunner.commitTransaction();

      return newRecommendation;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      if (err instanceof RecommendationForbiddenError) {
        throw new RecommendationForbiddenError(err.message);
      } else if (err instanceof UserDontExistError) {
        throw new UserDontExistError(err.message);
      } else {
        console.error(err);
      }
    } finally {
      await queryRunner.release();
    }
  }

  async removeUserRecommendation(
    removeRecommendationDto: RemoveRecommendationDto,
  ) {
    const { recommendedDiscordId, recommenderDiscordId, type } =
      removeRecommendationDto;

    const queryRunner = this.dataSource.createQueryRunner();
    const entityManager = queryRunner.manager;

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const recommenderUser = await entityManager.findOne(UsersEntity, {
        where: {
          discordId: recommenderDiscordId,
        },
        relations: {
          userRank: {
            rank: true,
          },
        },
      });
      if (!recommenderUser) {
        throw new UserDontExistError();
      }

      const recommendedUser = await entityManager.findOne(UsersEntity, {
        where: {
          discordId: recommendedDiscordId,
        },
        relations: {
          userRank: {
            rank: true,
          },
          userPromotion: true,
          recommendationsRecived: true,
        },
      });
      if (!recommendedUser) throw new UserDontExistError();

      const removedEntity = await entityManager.delete(RecommendationsEntity, {
        recommended_discordId: recommendedDiscordId,
        recommender_discordId: recommenderDiscordId,
        type: type.toString(),
      });

      if (removedEntity.affected)
        await this.checkPromotion(
          recommendedUser,
          type,
          RecommendationsAction.remove,
          { entityManager },
        );

      await queryRunner.commitTransaction();

      return removedEntity;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      if (err instanceof UserDontExistError) {
        throw new UserDontExistError(err.message);
      } else {
        console.error(err);
      }
    } finally {
      await queryRunner.release();
    }
  }

  async checkPromotion(
    recommendedUser: UsersEntity,
    type: number,
    action: RecommendationsAction,
    options?: ServiceOptions,
  ) {
    const calculatedRecommendations = calcCurrentRecommendationNumber(
      recommendedUser.recommendationsRecived,
    );

    const entityManager =
      options?.entityManager || this.dataSource.createEntityManager();

    const userPromotionObject = {
      ready: false,
      locked: false,
    };

    if (type === action) {
      if (recommendedUser.recommendationsRecived.length) {
        const isPromotionAvaiable = checkPromotionAvaiable(
          recommendedUser.userRank.rank.name,
          recommendedUser.userRank.rank.corps,
          calculatedRecommendations + 1,
        );

        if (isPromotionAvaiable) {
          userPromotionObject.ready = true;

          switch (recommendedUser.userRank.rank.name) {
            case RankTypes.PLUTONOWY:
            case RankTypes.STARSZY_SIERZANT:
              userPromotionObject.locked = true;
            default:
              userPromotionObject.locked = false;
          }

          await this.userPromotionSerivce.updateUserPromotion(
            recommendedUser.discordId,
            userPromotionObject,
            { entityManager },
          );
        }
      }
    } else {
      const isPromotionAvaiable = checkPromotionAvaiable(
        recommendedUser.userRank.rank.name,
        recommendedUser.userRank.rank.corps,
        calculatedRecommendations - 1,
      );

      if (!isPromotionAvaiable) {
        await this.userPromotionSerivce.updateUserPromotion(
          recommendedUser.discordId,
          userPromotionObject,
          { entityManager },
        );
      }
    }
  }
}
