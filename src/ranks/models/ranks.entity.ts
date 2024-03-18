import { UserRank } from 'src/userRank/models/userRank.dto';
import { UserRankEntity } from 'src/userRank/models/userRank.entity';
import { UserRankHistoryEntity } from 'src/userRankHistory/models/userRankHistory.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum CorpsTypes {
  OFICEROW = 'Oficerów',
  PODOFICEROW = 'Podoficerów',
  STRZELCOW = 'Strzelców',
}

export enum RankTypes {
  GENERAL = 'Generał',
  PULKOWNIK = 'Pułkownik',
  MAJOR = 'Major',
  KAPITAN = 'Kapitan',
  PORUCZNIK = 'Porucznik',
  STARSZY_CHORAZY = 'Starszy Chorąży',
  CHORAZY = 'Chorąży',
  STARSZY_SIERZANT = 'Starszy Sierżant',
  SIERZANT = 'Sierżant',
  PLUTONOWY = 'Plutonowy',
  STARSZY_KAPRAL = 'Starszy Kapral',
  KAPRAL = 'Kapral',
  STARSZY_SZEREGOWY = 'Starszy Szeregowy',
  SZEREGOWY = 'Szeregowy',
  POBOROWY = 'Poborowy',
}

@Entity('ranks')
export class RanksEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int' })
  order: number;

  @Column({ type: 'int' })
  number: number;

  @Column({ type: 'enum', enum: RankTypes })
  name: string;

  @Column({ type: 'enum', enum: CorpsTypes })
  corps: string;

  @OneToMany(() => UserRankEntity, (userRank) => userRank.rank)
  userRank: UserRankEntity[];

  @OneToMany(
    () => UserRankHistoryEntity,
    (userRankHistory) => userRankHistory.rank,
  )
  userRankHistory: UserRankHistoryEntity;
}
