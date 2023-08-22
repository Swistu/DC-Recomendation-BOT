import { RanksEntity } from 'src/ranks/models/ranks.entity';
import { UserRankEntity } from 'src/userRank/models/userRank.entity';
import { UsersEntity } from 'src/users/models/users.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('userPromotion')
export class UserPromotionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: false })
  ready: boolean;

  @Column({ nullable: false, default: false })
  blocked: boolean;

  @Column({ type: 'bigint', name: 'discord_id', nullable: false })
  discord_id: string;

  @OneToOne(() => UsersEntity, (user) => user.discord_id)
  @JoinColumn({
    name: 'discord_id',
  })
  user_entity: UsersEntity

  @OneToOne(() => UserRankEntity, (userRank) => userRank.discord_id)
  userRank: UserRankEntity
}
