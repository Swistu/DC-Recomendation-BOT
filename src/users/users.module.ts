import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users.controller';
import { UsersEntity } from './models/users.entity';
import { UsersService } from './services/users.service';
import {RanksEntity} from "../ranks/models/ranks.entity";
import {UserRolesEntity} from "../userRoles/models/userRoles.entity";
import {UserRankModule} from "../userRank/userRank.module";
import {UserPromotionModule} from "../userPromotion/userPromotion.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity, UserRolesEntity, RanksEntity]),
    DiscordModule.forFeature(),
    UserRankModule,
    UserPromotionModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
