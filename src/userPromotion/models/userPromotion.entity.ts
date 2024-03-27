import { UserRankEntity } from "../../userRank/models/userRank.entity";
import { UsersEntity } from '../../users/models/users.entity';
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
  discord_id: string;

  @OneToOne(() => UsersEntity, (user) => user.discord_id)
  @JoinColumn({
    name: 'discord_id',
  })
  user_entity: UsersEntity;

  @OneToOne(() => UserRankEntity, (userRank) => userRank.id)
  @JoinColumn({ name: 'userRank_id' })
  userRank: UserRankEntity;
}
