import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users.controller';
import { UsersEntity } from './models/users.entity';
import { UsersService } from './services/users.service';
import { UserRolesEntity } from 'src/userRoles/models/userRoles.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity, UserRolesEntity]),
    DiscordModule.forFeature(),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
