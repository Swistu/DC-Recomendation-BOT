import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { InjectDynamicProviders } from 'nestjs-dynamic-providers';
import {UsersModule} from "../users/users.module";
import {RecommendationsModule} from "../recommendations/recommendations.module";
import {UserPromotionModule} from "../userPromotion/userPromotion.module";
import {UserRankModule} from "../userRank/userRank.module";

@InjectDynamicProviders('**/*.command.js')
@Module({
  imports: [
    DiscordModule.forFeature(),
    UsersModule,
    RecommendationsModule,
    UserPromotionModule,
    UserRankModule,
  ],
})
export class BotSlashCommandsModule {}
