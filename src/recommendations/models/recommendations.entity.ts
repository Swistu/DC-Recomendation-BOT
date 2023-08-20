import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { RecommendationsTypes } from './recommendations.dto';
import { UsersEntity } from 'src/users/models/users.entity';

@Entity('recommendations')
export class RecommendationsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  reason: string;

  @Column({ type: 'enum', enum: RecommendationsTypes, nullable: false })
  type: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({name: 'recommended_discord_id'})
  recommended_discord_id: string;
  @Column({name: 'recommender_discord_id'})
  recommender_discord_id: string;

  @ManyToOne(() => UsersEntity, user => user.discord_id)
  @JoinColumn({ name: 'recommender_discord_id' })
  recommender_user: UsersEntity

  @ManyToOne(() => UsersEntity, user => user.discord_id)
  @JoinColumn({ name: 'recommended_discord_id' })
  recommended_user: UsersEntity
}
