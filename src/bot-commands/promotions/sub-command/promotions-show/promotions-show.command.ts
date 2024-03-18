import {Handler, InteractionEvent, SubCommand,} from '@discord-nestjs/core';
import {Inject, Injectable} from '@nestjs/common';
import {CommandInteraction,} from 'discord.js';
import {UsersService} from 'src/users/services/users.service';
import {UserPromotionService} from 'src/userPromotion/services/userPromotion.service';

@SubCommand({
  name: 'pokaż',
  description: 'pokazuje wszystkie dostępne awanse',
})
@Injectable()
export class PromotionsShowSubCommand {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
    @Inject(UserPromotionService)
    private readonly userPromotionService: UserPromotionService,
  ) {}

  @Handler()
  async onBaseInfo(@InteractionEvent() interaction: CommandInteraction) {
    await interaction.reply('Trwa sprawdzanie awansów');

    try {
      const usersToPromote =
        await this.userPromotionService.checkAllPromotions();

      let responseText = 'Ludzie do awansu\n';
      if (usersToPromote.length) {
        responseText = 'Ludzie do awansu\n';
        usersToPromote.forEach((promotion) => {
          responseText += `${promotion.currentRankName} <@${promotion.discordId}> awansuje na ${promotion.newRankName}\n`;
        });
      } else responseText = 'Brak ludzi do awansu\n';

      await interaction.editReply(responseText);
    } catch (err) {
      if (err?.message) {
        await interaction.editReply(err?.message);
      } else {
        await interaction.editReply('Wystąpił błąd');
      }

      console.error(err);
    }
  }
}
