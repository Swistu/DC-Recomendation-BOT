import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionRankingEntity } from './models/promotionRanking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PromotionRankingEntity])],
})
export class PromotionRankingModule {}
