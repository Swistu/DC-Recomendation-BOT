import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'recommended_discord_id' })
  recommendedDiscordId: string;
  @Column({ name: 'recommender_discord_id' })
  recommenderDiscordId: string;

  @ManyToOne(() => UsersEntity, (user) => user.discordId)
  @JoinColumn({ name: 'recommender_discord_id' })
  recommenderUser: UsersEntity;

  @ManyToOne(() => UsersEntity, (user) => user.discordId)
  @JoinColumn({ name: 'recommended_discord_id' })
  recommendedUser: UsersEntity;
}
