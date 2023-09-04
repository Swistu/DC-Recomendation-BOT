import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPromotionService } from './services/userPromotion.service';
import { UserPromotionController } from './controllers/userPromotion.controller';
import { UserPromotionEntity } from './models/userPromotion.entity';
import { UsersEntity } from 'src/users/models/users.entity';
import { RanksModule } from 'src/ranks/ranks.module';
import { UserRankModule } from 'src/userRank/userRank.module';
import { RanksEntity } from 'src/ranks/models/ranks.entity';
import { UserRankEntity } from 'src/userRank/models/userRank.entity';
import { UserRankHistoryModule } from 'src/userRankHistory/userRankHistory.module';
import { RecommendationsModule } from 'src/recommendations/recommendations.module';

@Module({
  imports: [
    forwardRef(() => UserRankHistoryModule),
    TypeOrmModule.forFeature([
      UserPromotionEntity,
      UserRankEntity,
      UsersEntity,
    ]),
    RanksModule,
    UserRankModule,
    UserRankHistoryModule,
  ],
  controllers: [UserPromotionController],
  providers: [UserPromotionService],
  exports: [UserPromotionService],
})
export class UserPromotionModule {}
