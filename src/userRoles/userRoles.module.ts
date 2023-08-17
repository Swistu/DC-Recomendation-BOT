import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRolesEntity } from './models/userRoles.entity';
import { UserRolesController } from './controllers/userRoles.controller';
import { UserRolesService } from './services/userRoles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRolesEntity]),
    DiscordModule.forFeature(),
  ],
  providers: [UserRolesService],
  controllers: [UserRolesController],
})
export class UserRolesModule { }
