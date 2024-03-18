import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendationsHistoryEntity } from './models/recommendationsHistory.entity';
import { RecommendationsHistoryService } from './service/recommendationsHistory.service';
import { RecommendationsHistoryController } from './controllers/recommendationsHistory.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RecommendationsHistoryEntity])],
  controllers: [RecommendationsHistoryController],
  providers: [RecommendationsHistoryService],
  exports: [RecommendationsHistoryService],
})
export class RecommendationsHistoryModule {}
