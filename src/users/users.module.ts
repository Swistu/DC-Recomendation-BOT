import { DiscordModule } from '@discord-nestjs/core';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users.controller';
import { UsersEntity } from './models/users.entity';
import { UsersService } from './services/users.service';
import { UserRolesEntity } from 'src/userRoles/models/userRoles.entity';
import { RanksEntity } from 'src/ranks/models/ranks.entity';
import { UserRankModule } from 'src/userRank/userRank.module';
import { UserPromotionModule } from 'src/userPromotion/userPromotion.module';

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
