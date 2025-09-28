import { UserRankEntity } from 'src/userRank/models/userRank.entity';
import { UsersEntity } from 'src/users/models/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('userPromotion')
export class UserPromotionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: false })
  ready: boolean;

  @Column({ nullable: false, default: false })
  blocked: boolean;

  @Column({ type: 'bigint', name: 'discord_id', nullable: false })
  discordId: string;

  @OneToOne(() => UsersEntity, (user) => user.discordId)
  @JoinColumn({
    name: 'discord_id',
  })
  userEntity: UsersEntity;

  @OneToOne(() => UserRankEntity, (userRank) => userRank.id)
  @JoinColumn({ name: 'user_rank_id' })
  userRank: UserRankEntity;
}
