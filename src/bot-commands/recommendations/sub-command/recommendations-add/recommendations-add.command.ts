import { SlashCommandPipe } from '@discord-nestjs/common';
import { Handler, InteractionEvent, SubCommand } from '@discord-nestjs/core';
import { RecommendationAddDto } from './recommendations-add.dto';
import { Inject, Injectable } from '@nestjs/common';
import { CommandInteraction, EmbedBuilder, GuildMember } from 'discord.js';
import { UsersService } from 'src/users/services/users.service';
import { RecommendationsService } from 'src/recommendations/service/recommendations.service';

@SubCommand({ name: 'dodaj', description: 'Dodaje rekomendacje' })
@Injectable()
export class RecommendationAddSubCommand {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
    @Inject(RecommendationsService)
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Handler()
  async onBaseInfo(
    @InteractionEvent(SlashCommandPipe) dto: RecommendationAddDto,
    @InteractionEvent() interaction: CommandInteraction,
  ) {
    const user = interaction.member as GuildMember;

    if (!user) {
      await interaction.reply('Podano niewłaściwego gracza.');
      return;
    }

    const giveRecommendationDto = {
      recommenderDiscordId: interaction.user.id,
      recommendedDiscordId: dto.user,
      reason: dto.reason,
      type: dto.type,
    };

    const embed = new EmbedBuilder().setDescription(
      'Trwa sprawdzanie rekomendacji!',
    );
    await interaction.reply({ embeds: [embed], ephemeral: false });

    try {
      const giveRecommendation =
        await this.recommendationsService.giveUserRecommendation(
          giveRecommendationDto,
        );

      if (giveRecommendation)
        embed.setDescription(
          `<@${giveRecommendation.recommenderDiscordId}> dał rekomendacje dla<@${giveRecommendation.recommendedDiscordId}>\n ${giveRecommendation.reason}`,
        );
      else embed.setDescription('Nie udało się dodać rekomendacji!');

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      embed.setDescription(err.message);
      await interaction.editReply({ embeds: [embed] });
    }
  }
}
