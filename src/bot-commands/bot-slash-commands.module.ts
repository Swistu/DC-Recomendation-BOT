import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { InjectDynamicProviders } from 'nestjs-dynamic-providers';
import { RecommendationsModule } from 'src/recommendations/recommendations.module';
import { UsersModule } from 'src/users/users.module';

@InjectDynamicProviders('**/*.command.js')
@Module({
  imports: [DiscordModule.forFeature(), UsersModule, RecommendationsModule],
})
export class BotSlashCommandsModule { }
