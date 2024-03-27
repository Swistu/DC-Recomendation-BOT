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
import { UserRolesEntity } from '../../userRoles/models/userRoles.entity';
import { UserRankEntity } from "../../userRank/models/userRank.entity";
import { RecommendationsEntity } from '../../recommendations/models/recommendations.entity';
import {UserRankHistoryEntity} from "../../userRankHistory/models/userRankHistory.entity";
import { UserPromotionEntity } from '../../userPromotion/models/userPromotion.entity';

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
