import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPromotionService } from './services/userPromotion.service';
import { UserPromotionController } from './controllers/userPromotion.controller';
import { UserPromotionEntity } from './models/userPromotion.entity';
import { DiscordModule } from '@discord-nestjs/core';
import {UserRankEntity} from "../userRank/models/userRank.entity";
import {UsersEntity} from "../users/models/users.entity";
import {RanksModule} from "../ranks/ranks.module";
import {UserRankModule} from "../userRank/userRank.module";
import {UserRankHistoryModule} from "../userRankHistory/userRankHistory.module";

@Module({
  imports: [
    DiscordModule.forFeature(),
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
