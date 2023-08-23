import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { RecommendationsEntity } from '../models/recommendations.entity';
import { UsersEntity } from 'src/users/models/users.entity';
import { GiveRecommendationDto, RecommendationsAction, RecommendationsTypes, RemoveRecommendationDto } from '../models/recommendations.dto';
import { parseCorpsName } from 'src/utility/parseCorpsName';
import { CorpsTypes, RankTypes } from 'src/ranks/models/ranks.entity';
import { RecommendationForbiddenError, UserDontExistError } from 'src/utility/errorTypes';
import { calcCurrentRecommendationNumber, checkPromotionAvaiable, checkRecommendationRequiredToPromote, isUserRecommendationInList } from 'src/utility/recommendation.utility';
import { UserPromotionService } from 'src/userPromotion/services/userPromotion.service';

export class RecommendationsService {
  constructor(
    @InjectRepository(RecommendationsEntity)
    private readonly recommendationsRepository: Repository<RecommendationsEntity>,

    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,

    private dataSource: DataSource,
    private userPromotionSerivce: UserPromotionService,
  ) { }

  async getUserRecommendations(discordId: string) {
    const userRecommendations = await this.userRepository.find({
      where: {
        discord_id: discordId
      },
      relations: { recommendations_recived: true }
    });

    return userRecommendations;
  }

  async giveUserRecommendation(giveRecommendationDto: GiveRecommendationDto) {
    const { recommendedDiscordId, recommenderDiscordId, reason, type } = giveRecommendationDto;
    let newRecommendation: RecommendationsEntity | undefined;

    if (recommendedDiscordId === recommenderDiscordId)
      throw new RecommendationForbiddenError;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const recommenderUser = await this.userRepository.findOne({
        where: {
          discord_id: recommenderDiscordId
        },
        relations: {
          userRank: {
            rank: true
          }
        }
      });
      if (!recommenderUser) {
        throw new UserDontExistError;
      }

      const recommendedUser = await this.userRepository.findOne({
        where: {
          discord_id: recommendedDiscordId
        },
        relations: {
          userRank: {
            rank: true
          },
          userPromotion: true,
          recommendations_recived: true
        }
      });
      if (!recommendedUser)
        throw new UserDontExistError;

      if (recommendedUser.userPromotion.ready && type)
        throw new RecommendationForbiddenError('Gracz już ma awans!');

      if (isUserRecommendationInList(recommenderUser.discord_id, recommendedUser.recommendations_recived, type.toString()))
        throw new RecommendationForbiddenError('Już dałeś rekomendację graczowi');

      const recommenderCorpsNumber = parseCorpsName(recommenderUser.userRank.rank.corps);
      const recommendedCorpsNumber = parseCorpsName(recommendedUser.userRank.rank.corps);

      if (recommenderUser.userRank.rank.name !== RankTypes.PULKOWNIK) {
        if (type === RecommendationsTypes.negative) {
          throw new RecommendationForbiddenError('Nie możesz dawać ujemnych rekomendacji!');
        }
        if (recommenderCorpsNumber > recommendedCorpsNumber) {
          if (recommenderUser.userRank.rank.corps === CorpsTypes.PODOFICEROW && recommendedUser.userRank.rank.name === RankTypes.PLUTONOWY) {
            throw new RecommendationForbiddenError('Masz za niski stopień, aby dać rekomendacje tej osobie!');
          }
        } else {
          throw new RecommendationForbiddenError;
        }
      }

      await this.checkPromotion(recommendedUser, type, RecommendationsAction.add);

      newRecommendation = this.recommendationsRepository.create({
        reason: reason,
        type: type.toString(),
        recommended_discord_id: recommendedDiscordId,
        recommender_discord_id: recommenderDiscordId,
      });

      await this.recommendationsRepository.save(newRecommendation)
    } catch (err) {
      if (err instanceof RecommendationForbiddenError) {
        throw new RecommendationForbiddenError(err.message);
      } else if (err instanceof UserDontExistError) {
        throw new UserDontExistError;
      } else {
        console.error(err);
      }

      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return newRecommendation;
  }

  async removeUserRecommendation(removeRecommendationDto: RemoveRecommendationDto) {
    const { recommendedDiscordId, recommenderDiscordId, type } = removeRecommendationDto;
    let removedEntity: DeleteResult;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const recommenderUser = await this.userRepository.findOne({
        where: {
          discord_id: recommenderDiscordId
        },
        relations: {
          userRank: {
            rank: true
          }
        }
      });
      if (!recommenderUser) {
        throw new UserDontExistError;
      }

      const recommendedUser = await this.userRepository.findOne({
        where: {
          discord_id: recommendedDiscordId
        },
        relations: {
          userRank: {
            rank: true
          },
          userPromotion: true,
          recommendations_recived: true
        }
      });
      if (!recommendedUser)
        throw new UserDontExistError;

      removedEntity = await this.recommendationsRepository.delete({ recommended_discord_id: recommendedDiscordId, recommender_discord_id: recommenderDiscordId, type: type.toString() });

      if (removedEntity.affected)
        await this.checkPromotion(recommendedUser, type, RecommendationsAction.remove);

    } catch (err) {
      if (err instanceof UserDontExistError) {
        throw new UserDontExistError(err.message);
      } else {
        console.error(err);
      }
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return removedEntity
  }

  async checkPromotion(recommendedUser: UsersEntity, type: number, action: RecommendationsAction) {
    const calculatedRecommendations = calcCurrentRecommendationNumber(recommendedUser.recommendations_recived);



    if (type === action) {
      if (recommendedUser.recommendations_recived.length) {
        const isPromotionAvaiable = checkPromotionAvaiable(recommendedUser.userRank.rank.name, recommendedUser.userRank.rank.corps, calculatedRecommendations + 1);

        if (isPromotionAvaiable) {
          const userPromotionObject = {
            ready: true,
            locked: false
          }

          switch (recommendedUser.userRank.rank.name) {
            case RankTypes.PLUTONOWY:
            case RankTypes.STARSZY_SIERZANT:
              userPromotionObject.locked = true;
            default:
              userPromotionObject.locked = false;
          }

          await this.userPromotionSerivce.updateUserPromotion(recommendedUser.discord_id, userPromotionObject);
        }
      }
    } else {
      const isPromotionAvaiable = checkPromotionAvaiable(recommendedUser.userRank.rank.name, recommendedUser.userRank.rank.corps, calculatedRecommendations - 1);

      if (!isPromotionAvaiable) {
        const userPromotionObject = {
          ready: false,
          locked: false
        }

        await this.userPromotionSerivce.updateUserPromotion(recommendedUser.discord_id, userPromotionObject);
      }
    }
  }
}
