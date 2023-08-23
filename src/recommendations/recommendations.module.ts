import { Module } from '@nestjs/common';
import { RecommendationsController } from './controller/recommendations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendationsEntity } from './models/recommendations.entity';
import { RecommendationsService } from './service/recommendations.service';
import { UsersEntity } from 'src/users/models/users.entity';
import { UserPromotionModule } from 'src/userPromotion/userPromotion.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecommendationsEntity, UsersEntity]),
    UserPromotionModule
  ],
  controllers: [RecommendationsController],
  providers: [RecommendationsService],
  exports: [RecommendationsService]
})
export class RecommendationsModule { }
