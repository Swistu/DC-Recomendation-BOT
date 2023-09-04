import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersEntity } from 'src/users/models/users.entity';
import { RanksEntity } from 'src/ranks/models/ranks.entity';
import { RecommendationsHistoryEntity } from 'src/recommendationsHistory/models/recommendationsHistory.entity';

@Entity('userRankHistory')
export class UserRankHistoryEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'bigint', name: 'discord_id', nullable: false })
  discord_id: string;

  @Column({ name: 'rank_id', nullable: false })
  rank_id: number;

  @Column({ type: 'date', nullable: false })
  rank_start_date: Date;

  @CreateDateColumn()
  rank_end_date: Date;

  @ManyToOne(() => UsersEntity, (user) => user.discord_id)
  @JoinColumn({ name: 'discord_id' })
  user: UsersEntity;

  @ManyToOne(() => RanksEntity, (ranks) => ranks.id)
  @JoinColumn({ name: 'rank_id' })
  rank: RanksEntity;

  @OneToMany(
    () => RecommendationsHistoryEntity,
    (recommendationHistory) => recommendationHistory.id,
  )
  recommendationsHistoryEntity: RecommendationsHistoryEntity;
}
