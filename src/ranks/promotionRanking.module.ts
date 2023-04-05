import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RanksEntity } from './models/ranks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RanksEntity])],
})
export class PromotionRankingModule {}
