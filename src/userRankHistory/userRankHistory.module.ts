import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRankHistoryEntity } from './models/userRankHistory.entity';
import { UserRankHistoryController } from './controllers/userRankHistory.controller';
import { UserRankHistoryService } from './services/userRankHistory.service';
import { RecommendationsModule } from 'src/recommendations/recommendations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRankHistoryEntity]),
    RecommendationsModule
  ],
  providers: [UserRankHistoryService],
  controllers: [UserRankHistoryController],
})
export class UserRankHistoryModule { }
