import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPromotionService } from './services/userPromotion.service';
import { UserPromotionController } from './controllers/userPromotion.controller';
import { UserPromotionEntity } from './models/userPromotion.entity';
import { UsersEntity } from 'src/users/models/users.entity';
import { RanksModule } from 'src/ranks/ranks.module';
import { UserRankModule } from 'src/userRank/userRank.module';
import { RanksEntity } from 'src/ranks/models/ranks.entity';
import { UserRankEntity } from 'src/userRank/models/userRank.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserPromotionEntity, UserRankEntity, UsersEntity]),
    RanksModule,
    UserRankModule
  ],
  controllers: [UserPromotionController],
  providers: [UserPromotionService],
  exports: [UserPromotionService]
})
export class UserPromotionModule { }
