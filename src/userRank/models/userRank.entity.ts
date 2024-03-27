import { RanksEntity } from '../../ranks/models/ranks.entity';
import { UsersEntity } from '../../users/models/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('userRank')
export class UserRankEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RanksEntity, (rank) => rank.id)
  @JoinColumn({ name: 'rank_id' })
  rank: RanksEntity;

  @CreateDateColumn()
  rank_start_date: Date;

  @Column({ type: 'bigint', name: 'discord_id' })
  discord_id: string;

  @OneToOne(() => UsersEntity, (user) => user.discord_id)
  @JoinColumn({
    name: 'discord_id',
  })
  users: UsersEntity;
}
