import { RanksEntity } from 'src/ranks/models/ranks.entity';
import { UsersEntity } from 'src/users/models/users.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('userRank')
export class UserRankEntity {
  @PrimaryColumn({ type: 'bigint' })
  discordId: string;
  @OneToOne(() => UsersEntity, { "cascade": true })
  @JoinColumn({ name: "discordId" } )  // This matches @PrimaryColumn name
  user: UsersEntity;

  @Column()
  rankId: number;
  @OneToOne(() => RanksEntity, { "cascade": true })
  @JoinColumn({ name: "rankId" })
  rank: RanksEntity;

  @CreateDateColumn()
  rankStartDate: Date;
}
