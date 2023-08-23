import { SlashCommandPipe } from "@discord-nestjs/common";
import { Handler, IA, InteractionEvent, SubCommand } from "@discord-nestjs/core";
import { RecommendationRemoveDto } from "./recommendations-remove.dto";
import { Inject, Injectable } from "@nestjs/common";
import { CommandInteraction, EmbedBuilder, GuildMember, InteractionCollector, InteractionReplyOptions } from "discord.js";
import { UsersService } from "src/users/services/users.service";
import { RecommendationsService } from "src/recommendations/service/recommendations.service";
import { RecommendationsEntity } from "src/recommendations/models/recommendations.entity";

@SubCommand({ name: 'usuń', description: 'Usuwa rekomendację' })
@Injectable()
export class RecommendationRemoveSubCommand {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
    @Inject(RecommendationsService)
    private readonly recommendationsService: RecommendationsService
  ) { }

  @Handler()
  async onBaseInfo(@InteractionEvent(SlashCommandPipe) dto: RecommendationRemoveDto, @InteractionEvent() interaction: CommandInteraction) {
    const user = interaction.options.getMember('user') as GuildMember;

    if (!user) {
      await interaction.reply('Podano niewłaściwego gracza.');
      return;
    }

    const removeRecommendationDto = {
      recommenderDiscordId: interaction.user.id,
      recommendedDiscordId: dto.user,
      type: dto.type,
    }

    const embed = new EmbedBuilder().setDescription('Trwa sprawdzanie rekomendacji!');
    await interaction.reply({ embeds: [embed], ephemeral: false });

    

    try {
      const removeRecommendation = await this.recommendationsService.removeUserRecommendation(removeRecommendationDto);

      if (removeRecommendation.affected)
        embed.setDescription(`<@${removeRecommendationDto.recommenderDiscordId}> usunął swoją rekomendacje <@${removeRecommendationDto.recommendedDiscordId}>!`);
      else
        embed.setDescription(`Nie udało się usunąc rekomendacji <@${removeRecommendationDto.recommendedDiscordId}>!`);

      await interaction.editReply({ embeds: [embed] });

    } catch (err) {
      embed.setDescription(err.message);
      await interaction.editReply({ embeds: [embed] });
    }
  }
}
