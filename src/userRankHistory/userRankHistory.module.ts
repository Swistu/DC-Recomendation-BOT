import { DiscordModule } from '@discord-nestjs/core';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRankHistoryEntity } from './models/userRankHistory.entity';
import { UserRankHistoryController } from './controllers/userRankHistory.controller';
import { UserRankHistoryService } from './services/userRankHistory.service';
import { RecommendationsModule } from 'src/recommendations/recommendations.module';
import { UserPromotionModule } from 'src/userPromotion/userPromotion.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserRankHistoryEntity])],
  providers: [UserRankHistoryService],
  controllers: [UserRankHistoryController],
  exports: [UserRankHistoryService],
})
export class UserRankHistoryModule {}
