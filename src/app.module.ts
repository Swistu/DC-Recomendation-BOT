import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GatewayIntentBits } from 'discord.js';
import { ActivityLogModule } from './activitylog/activitylog.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotSlashCommandsModule } from './bot-commands/bot-slash-commands.module';
import { BotModule } from './bot/bot.module';
import { PromotionRankingModule } from './promotionRanking/promotionRanking.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(<string>process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    DiscordModule.forRootAsync({
      useFactory: () => ({
        token: process.env.DISCORD_BOT_TOKEN,
        discordClientOptions: {
          intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
        },
      }),
    }),
    UsersModule,
    ActivityLogModule,
    PromotionRankingModule,
    BotModule,
    BotSlashCommandsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
