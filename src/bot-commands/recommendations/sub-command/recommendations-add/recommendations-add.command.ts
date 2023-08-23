import { SlashCommandPipe } from "@discord-nestjs/common";
import { Handler, IA, InteractionEvent, SubCommand } from "@discord-nestjs/core";
import { RecommendationAddDto } from "./recommendations-add.dto";
import { Inject, Injectable } from "@nestjs/common";
import { CommandInteraction, EmbedBuilder, GuildMember, InteractionCollector, InteractionReplyOptions } from "discord.js";
import { UsersService } from "src/users/services/users.service";
import { RecommendationsService } from "src/recommendations/service/recommendations.service";
import { RecommendationsEntity } from "src/recommendations/models/recommendations.entity";

@SubCommand({ name: 'dodaj', description: 'pokazuje infromacje o graczu' })
@Injectable()
export class RecommendationAddSubCommand {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
    @Inject(RecommendationsService)
    private readonly recommendationsService: RecommendationsService
  ) { }

  @Handler()
  async onBaseInfo(@InteractionEvent(SlashCommandPipe) dto: RecommendationAddDto, @InteractionEvent() interaction: CommandInteraction) {
    const user = interaction.options.getMember('user') as GuildMember;

    if (!user) {
      await interaction.reply('Podano niewłaściwego gracza.');
      return;
    }

    const giveRecommendationDto = {
      recommenderDiscordId: interaction.user.id,
      recommendedDiscordId: dto.user,
      reason: dto.reason,
      type: dto.type,
    }

    const embed = new EmbedBuilder().setDescription('Trwa sprawdzanie rekomendacji!');
    await interaction.reply({ embeds: [embed], ephemeral: false });

    try {
      const giveRecommendation = await this.recommendationsService.giveUserRecommendation(giveRecommendationDto);

      if (giveRecommendation) {
        embed.setDescription('Dodano rekomendacje!');
      } else {
        embed.setDescription('Nie udało się dodać rekomendacji!');
      }
    } catch (err) {
      embed.setDescription(err.message);
      await interaction.editReply({ embeds: [embed] });
    }
  }
}
