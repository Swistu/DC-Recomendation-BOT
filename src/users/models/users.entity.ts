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
import { UserRankHistoryEntity } from 'src/userRankHistory/models/userRankHistory.entity';
import { UserPromotionEntity } from 'src/userPromotion/models/userPromotion.entity';

@Entity('users')
export class UsersEntity {
  @PrimaryColumn({ type: 'bigint', name: 'discord_id' })
  discordId: string;

  @Column({ type: 'boolean', default: false, name: 'account_active' })
  accountActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => UserRolesEntity, (userRolesEntity) => userRolesEntity.user, {
    nullable: false,
  })
  @JoinColumn({
    name: 'role_id',
  })
  role: UserRolesEntity;

  @OneToOne(() => UserRankEntity, (userRank) => userRank.discordId)
  @JoinColumn()
  userRank: UserRankEntity;

  @OneToMany(
    () => RecommendationsEntity,
    (reccomendation) => reccomendation.recommendedUser,
  )
  recommendationsRecived: RecommendationsEntity[];

  @OneToMany(
    () => RecommendationsEntity,
    (reccomendation) => reccomendation.recommenderUser,
  )
  recommendationsGiven: RecommendationsEntity[];

  @OneToMany(
    () => UserRankHistoryEntity,
    (userRankHistory) => userRankHistory.discordId,
  )
  userRankHistory: UserRankHistoryEntity;

  @OneToOne(() => UserPromotionEntity, (userPromotion) => userPromotion.id)
  @JoinColumn()
  userPromotion: UserPromotionEntity;
}
