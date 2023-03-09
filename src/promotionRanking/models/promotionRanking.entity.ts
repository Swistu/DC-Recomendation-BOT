import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('promotion_ranking')
export class PromotionRankingEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'int' })
  number: number;

  @Column()
  rank: string;

  @Column()
  corps: string;
}
