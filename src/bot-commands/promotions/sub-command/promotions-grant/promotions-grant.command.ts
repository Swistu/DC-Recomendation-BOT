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
    await interaction.reply('Trwa przyznawanie awansów');

    try {
      const allPromotion = await this.userPromotionService.grantAllPromotions();

      console.log(allPromotion, 'hehe');
      await interaction.editReply('konic');
    } catch (error) {
      if (error?.message)
        await interaction.editReply(error.message);
      else {
        await interaction.editReply('Wystąpił błąd');
      }

      console.error(error);
    }
  }
}
