import {
  Handler,
  IA,
  InteractionEvent,
  SubCommand,
} from '@discord-nestjs/core';
import { Inject, Injectable } from '@nestjs/common';
import {
  CommandInteraction,
  EmbedBuilder,
  GuildMember,
  InteractionCollector,
  InteractionReplyOptions,
} from 'discord.js';
import { UsersService } from 'src/users/services/users.service';
import { RecommendationsService } from 'src/recommendations/service/recommendations.service';
import { UserPromotionService } from 'src/userPromotion/services/userPromotion.service';
import { RankTypes } from 'src/ranks/models/ranks.entity';

@SubCommand({ name: 'przyznaj', description: 'Przyznaje wszystkie awanse' })
@Injectable()
export class PromotionsGrantSubCommand {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
    @Inject(UserPromotionService)
    private readonly userPromotionService: UserPromotionService,
  ) {}

  @Handler()
  async onBaseInfo(@InteractionEvent() interaction: CommandInteraction) {
    await interaction.reply('Trwa przyznawanie awansów');

    try {
      const intreactionUser = await this.usersService.getUser(
        interaction.user.id,
      );

      if (intreactionUser.userRank.rank.name !== RankTypes.PULKOWNIK) {
        await interaction.editReply('Nie możesz awansować graczy');
        return;
      }

      const allPromotion = await this.userPromotionService.grantAllPromotions();

      console.log(allPromotion);
      if (!allPromotion) {
        throw new Error();
      }
      let responseText: string;
      if (allPromotion.length) responseText = 'Lista zatwierdzonych awansów:\n';
      else return await interaction.editReply('Brak ludzi do awansu\n');

      allPromotion.forEach((promotion) => {
        responseText += `${promotion.currentRankName} <@${promotion.discordId}> awansuje na ${promotion.newRankName}\n`;
      });

      await interaction.editReply(
        responseText + '\n```\n' + responseText.slice(29) + '```\n',
      );
    } catch (error) {
      if (error?.message) await interaction.editReply(error.message);
      else await interaction.editReply('Wystąpił błąd');

      console.error(error);
    }
  }
}
