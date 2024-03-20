import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import {UserRankHistoryEntity} from "../../userRankHistory/models/userRankHistory.entity";
import {RecommendationsEntity} from "../../recommendations/models/recommendations.entity";

@Entity('recommendationsHistory')
export class RecommendationsHistoryEntity extends RecommendationsEntity {
  @Column({ type: 'int', name: 'user_rank_history_id', nullable: false })
  user_rank_history_id: number;

  @ManyToOne(
    () => UserRankHistoryEntity,
    (userRankHistory) => userRankHistory.id,
  )
  @JoinColumn({ name: 'user_rank_history_id' })
  user_rank_history_entity: UserRankHistoryEntity;
}
