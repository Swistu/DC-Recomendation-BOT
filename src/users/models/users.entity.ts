import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { UserRolesEntity } from 'src/userRoles/models/userRoles.entity';
import { UserRankEntity } from 'src/userRank/models/userRank.entity';
import { RecommendationsEntity } from 'src/recommendations/models/recommendations.entity';
import { RecommendationsHistoryEntity } from 'src/recommendationsHistory/models/recommendationsHistory.entity';
import { UserRankHistoryEntity } from 'src/userRankHistory/models/userRankHistory.entity';
import { UserPromotionEntity } from 'src/userPromotion/models/userPromotion.entity';

@Entity('users')
export class UsersEntity {
  @PrimaryColumn({ type: 'bigint' })
  discord_id: string;

  @Column({ type: 'boolean', default: false })
  account_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => UserRolesEntity, (userRolesEntity) => userRolesEntity.user, {
    nullable: false,
  })
  @JoinColumn({
    name: 'role_id',
  })
  role: UserRolesEntity;

  @OneToOne(() => UserRankEntity, (userRank) => userRank.discord_id)
  @JoinColumn()
  userRank: UserRankEntity;

  @OneToMany(
    () => RecommendationsEntity,
    (reccomendation) => reccomendation.recommended_user,
  )
  recommendations_recived: RecommendationsEntity[];

  @OneToMany(
    () => RecommendationsEntity,
    (reccomendation) => reccomendation.recommender_user,
  )
  recommendations_given: RecommendationsEntity[];

  @OneToMany(
    () => UserRankHistoryEntity,
    (userRankHistory) => userRankHistory.discord_id,
  )
  userRankHistory: UserRankHistoryEntity;

  @OneToOne(() => UserPromotionEntity, (userPromotion) => userPromotion.id)
  @JoinColumn()
  userPromotion: UserPromotionEntity;
}