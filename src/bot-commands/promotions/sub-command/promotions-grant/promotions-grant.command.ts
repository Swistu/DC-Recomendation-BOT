import { Handler, IA, InteractionEvent, SubCommand } from "@discord-nestjs/core";
import { Inject, Injectable } from "@nestjs/common";
import { CommandInteraction, EmbedBuilder, GuildMember, InteractionCollector, InteractionReplyOptions } from "discord.js";
import { UsersService } from "src/users/services/users.service";
import { RecommendationsService } from "src/recommendations/service/recommendations.service";
import { UserPromotionService } from "src/userPromotion/services/userPromotion.service";

@SubCommand({ name: 'przyznaj', description: 'Przyznaje wszystkie awanse' })
@Injectable()
export class PromotionsGrantSubCommand {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
    @Inject(UserPromotionService)
    private readonly userPromotionService: UserPromotionService
  ) { }

  @Handler()
  async onBaseInfo(@InteractionEvent() interaction: CommandInteraction) {

    await this.userPromotionService.grantAllPromotions();
    // await interaction.reply('Trwa sprawdzanie awansów');
    // const usersToPromote = await this.userPromotionService.checkAllPromotions();

    // let responseText = 'Ludzie do awansu\n';
    // if (usersToPromote.length)
    //   responseText = 'Ludzie do awansu\n';
    // else
    //   responseText = 'Brak ludzi do awansu\n';

    // usersToPromote.forEach((promotion) => {
    //   responseText += `${promotion.currentRankName} <@${promotion.discordId}> awansuje na ${promotion.newRankName}\n`;
    // });
    // await interaction.editReply(responseText);

    return;
  }
}
