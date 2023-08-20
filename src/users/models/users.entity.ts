import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { UserRolesEntity } from 'src/userRoles/models/userRoles.entity';
import { UserRankEntity } from 'src/userRank/models/userRank.entity';
import { RecommendationsEntity } from 'src/recommendations/models/recommendations.entity';

@Entity('users')
export class UsersEntity {
  @PrimaryColumn({ type: 'bigint' })
  discord_id: string;

  @Column({ type: 'boolean', default: false })
  account_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => UserRolesEntity, (userRolesEntity) => userRolesEntity.user, { nullable: false })
  @JoinColumn({
    name: 'role_id',
  })
  role: UserRolesEntity;

  @OneToOne(() => UserRankEntity, (userRank) => userRank.discord_id)
  userRank: UserRankEntity

  @OneToMany(() => RecommendationsEntity, user => user.recommended_user)
  recommendations_recived: RecommendationsEntity[]

  @OneToMany(() => RecommendationsEntity, user => user.recommender_user)
  recommendations_given: RecommendationsEntity[]
}
