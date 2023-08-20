import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from 'src/users/models/users.entity';
import { RecommendationsTypes } from 'src/recommendations/models/recommendations.dto';
import { RecommendationsEntity } from 'src/recommendations/models/recommendations.entity';
import { UserRankHistoryEntity } from 'src/userRankHistory/models/userRankHistory.entity';

@Entity('recommendationsHistory')
export class RecommendationsHistoryEntity extends RecommendationsEntity {
  @Column({ type: 'int', name: 'user_rank_history_id', nullable: false })
  user_rank_history_id: number;

  @OneToOne(() => UserRankHistoryEntity, (userRankHistory) => userRankHistory.id)
  @JoinColumn({name: 'user_rank_history_id'})
  user_rank_history_entity: UserRankHistoryEntity
}
