import { InjectRepository } from '@nestjs/typeorm';
import { from } from 'rxjs';
import { DataSource, Repository } from 'typeorm';
import { UserRankHistoryEntity } from '../models/userRankHistory.entity';
import { Injectable } from '@nestjs/common';
import { RecommendationsEntity } from 'src/recommendations/models/recommendations.entity';
import { SaveUserRankHistoryDto } from '../models/userRankHistory.dto';
import { ServiceOptions } from 'src/utility/generalClasses';
import { RecommendationsHistoryEntity } from 'src/recommendationsHistory/models/recommendationsHistory.entity';

@Injectable()
export class UserRankHistoryService {
  constructor(
    @InjectRepository(UserRankHistoryEntity)
    private readonly userRankHistoryRepository: Repository<UserRankHistoryEntity>,

    private dataSource: DataSource,
  ) {}

  getRole(roleId: number) {
    return from(this.userRankHistoryRepository.findOneBy({ id: roleId }));
  }

  async saveUserRankHistory(
    saveUserRankHistoryDto: SaveUserRankHistoryDto,
    options?: ServiceOptions,
  ) {
    const { discordId, promotionRankingId, rankStartDate } =
      saveUserRankHistoryDto;
    const queryRunner =
      options?.entityManager?.queryRunner ||
      this.dataSource.createQueryRunner();
    const entityManager = queryRunner.manager;

    try {
      if (!options?.entityManager) {
        await queryRunner.connect();
        await queryRunner.startTransaction();
      }

      const userRecommendations = await entityManager.find(
        RecommendationsEntity,
        {
          where: {
            recommendedDiscordId: discordId,
          },
        },
      );
      const userRankHistory = entityManager.create(UserRankHistoryEntity, {
        discordId: discordId,
        rankId: promotionRankingId,
        rankStartDate: rankStartDate,
      });
      await entityManager.save(userRankHistory);

      const userRecommendationHistory = userRecommendations.map(
        (recommendation) => {
          const recommendationHistory = entityManager.create(
            RecommendationsHistoryEntity,
            {
              ...recommendation,
              userRankHistoryId: userRankHistory.id,
              userRankHistoryEntity: userRankHistory,
            },
          );
          return recommendationHistory;
        },
      );
      await entityManager.save(userRecommendationHistory);

      if (!options?.entityManager) {
        await queryRunner.commitTransaction();
      }

      return userRecommendationHistory;
    } catch (error) {
      if (!options?.entityManager) {
        await queryRunner.rollbackTransaction();
      }
      console.error(error);
    } finally {
      if (!options?.entityManager) {
        await queryRunner.release();
      }
    }
  }
}
