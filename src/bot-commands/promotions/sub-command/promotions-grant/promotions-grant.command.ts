import {Handler, InteractionEvent, SubCommand,} from '@discord-nestjs/core';
import {Inject, Injectable} from '@nestjs/common';
import {CommandInteraction,} from 'discord.js';
import {UsersService} from 'src/users/services/users.service';
import {UserPromotionService} from 'src/userPromotion/services/userPromotion.service';
import {RankTypes} from 'src/ranks/models/ranks.entity';

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

    let loadingMessage = '.';
    const messageInterval = setInterval(async () => {
      await interaction.editReply('Trwa przyznawanie awansów' + loadingMessage);

      loadingMessage += '.';
      if (loadingMessage.length > 3) loadingMessage = '.';
    }, 1000);

    try {
      const intreactionUser = await this.usersService.getUser(
        interaction.user.id,
      );

      if (intreactionUser.userRank.rank.name !== RankTypes.PULKOWNIK) {
        await interaction.editReply('Nie możesz awansować graczy');
        return;
      }

      const allPromotion = await this.userPromotionService.grantAllPromotions();

      if (!allPromotion) {
        throw new Error();
      }
      let responseText: string;
      if (allPromotion.length) responseText = 'Lista zatwierdzonych awansów:\n';
      else {
        clearInterval(messageInterval);
        return await interaction.editReply('Brak ludzi do awansu\n');
      }
      allPromotion.forEach((promotion) => {
        responseText += `${promotion.currentRankName} <@${promotion.discordId}> awansuje na ${promotion.newRankName}\n`;
      });
      clearInterval(messageInterval);

      await interaction.editReply(
        responseText + '\n```\n' + responseText.slice(29) + '```\n',
      );
    } catch (error) {
      clearInterval(messageInterval);

      if (error?.message) await interaction.editReply(error.message);
      else await interaction.editReply('Wystąpił błąd');

      console.error(error);
    } finally {
      clearInterval(messageInterval);
    }
  }
}
