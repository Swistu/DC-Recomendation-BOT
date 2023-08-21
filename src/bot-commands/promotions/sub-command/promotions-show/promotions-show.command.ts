import { Handler, IA, InteractionEvent, SubCommand } from "@discord-nestjs/core";
import { Inject, Injectable } from "@nestjs/common";
import { CommandInteraction, EmbedBuilder, GuildMember, InteractionCollector, InteractionReplyOptions } from "discord.js";
import { UsersService } from "src/users/services/users.service";
import { RecommendationsService } from "src/recommendations/service/recommendations.service";

@SubCommand({ name: 'pokaż', description: 'pokazuje wszystkie dostępne awanse' })
@Injectable()
export class PromotionsShowSubCommand {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
    @Inject(RecommendationsService)
    private readonly recommendationsService: RecommendationsService
  ) { }

  @Handler()
  async onBaseInfo(@InteractionEvent() interaction: CommandInteraction) {
    const embed = new EmbedBuilder().setDescription('Trwa sprawdzanie rekomendacji!');
    await interaction.reply({ embeds: [embed], ephemeral: false });

    embed.setDescription('Nie udało się dodać rekomendacji!');
    
    await interaction.editReply({ embeds: [embed] });

    return;
  }
}
