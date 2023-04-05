import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ranks')
export class RanksEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int' })
  order: number;

  @Column({ type: 'int' })
  number: number;

  @Column()
  rank: string;

  @Column()
  corps: string;
}
