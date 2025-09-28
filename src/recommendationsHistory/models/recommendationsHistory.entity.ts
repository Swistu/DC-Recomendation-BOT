import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { RecommendationsEntity } from 'src/recommendations/models/recommendations.entity';
import { UserRankHistoryEntity } from 'src/userRankHistory/models/userRankHistory.entity';

@Entity('recommendationsHistory')
export class RecommendationsHistoryEntity extends RecommendationsEntity {
  @Column({ type: 'int', name: 'user_rank_history_id', nullable: false })
  userRankHistoryId: number;

  @ManyToOne(
    () => UserRankHistoryEntity,
    (userRankHistory) => userRankHistory.id,
  )
  @JoinColumn({ name: 'user_rank_history_id' })
  userRankHistoryEntity: UserRankHistoryEntity;
}
