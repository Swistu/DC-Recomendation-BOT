import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users.controller';
import { UsersEntity } from './models/users.entity';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity]),
    DiscordModule.forFeature(),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
