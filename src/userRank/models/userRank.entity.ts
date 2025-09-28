import { RanksEntity } from 'src/ranks/models/ranks.entity';
import { UsersEntity } from 'src/users/models/users.entity';
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
  rankStartDate: Date;

  @Column({ type: 'bigint', name: 'discord_id' })
  discordId: string;

  @OneToOne(() => UsersEntity, (user) => user.discordId)
  @JoinColumn({
    name: 'discord_id',
  })
  users: UsersEntity;
}
