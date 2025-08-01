import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GatewayIntentBits } from 'discord.js';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { UserRolesModule } from './userRoles/userRoles.module';
import { UserRankModule } from './userRank/userRank.module';
import { UserPromotionModule } from './userPromotion/userPromotion.module';
import { UserRankHistoryModule } from './userRankHistory/userRankHistory.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { RanksModule } from './ranks/ranks.module';
import { RecommendationsHistoryModule } from './recommendationsHistory/recommendationsHistory.module';
import { BotModule } from './bot/bot.module';
import { BotSlashCommandsModule } from './bot-commands/bot-slash-commands.module';
import { dataSourceOptions } from './config/data-source';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...dataSourceOptions, // <--- Spread the options from your data-source.ts
        // You can override specific options here if needed for the app context
        // For example, if you want logging only in dev but not in data-source.ts:
        // logging: configService.get<string>('NODE_ENV') === 'development',
        synchronize: true, // <--- Always false for production, handled by migrations
        // Ensure entities path is correct for runtime if using glob
        entities: ['dist/**/*.entity{.ts,.js}'], // Use compiled paths for runtime
        migrations: ['dist/migrations/*{.ts,.js}'], // Use compiled paths for runtime
      }),
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
    UserRolesModule,
    UserRankModule,
    UserRankHistoryModule,
    UserPromotionModule,
    RanksModule,
    RecommendationsModule,
    RecommendationsHistoryModule,
    BotModule,
    BotSlashCommandsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
