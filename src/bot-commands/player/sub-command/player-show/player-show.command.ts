import { SlashCommandPipe } from '@discord-nestjs/common';
import { Handler, IA, SubCommand } from '@discord-nestjs/core';
import { Inject, Injectable } from '@nestjs/common';
import { PlayerShowDto } from './player-show.dto';
import { CommandInteraction, EmbedBuilder, GuildMember } from 'discord.js';
import { UsersService } from 'src/users/services/users.service';
import {
  calcCurrentRecommendationNumber,
  checkRecommendationRequiredToPromote,
} from 'src/utility/recommendation.utility';

@SubCommand({ name: 'pokaż', description: 'pokazuje infromacje o graczu' })
@Injectable()
export class PlayerShowSubCommand {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
  ) {}

  @Handler()
  async onPlayerShow(
    @IA(SlashCommandPipe) dto: PlayerShowDto,
    @IA() interaction: CommandInteraction,
  ) {
    const user = interaction.member as GuildMember;

    if (!user) {
      await interaction.editReply('Podano niewłaściwego gracza.');
      return;
    }

    const embed = new EmbedBuilder().setDescription('Trwa sprawdzanie gracza!');
    await interaction.reply({ embeds: [embed], ephemeral: false });

    try {
      const userData = await this.usersService.getUser(dto.user);

      let userPositiveRecommendations = '';
      let userNegativeRecommendations = '';
      if (userData.recommendationsRecived.length) {
        userData.recommendationsRecived.forEach((element) => {
          if (element.type)
            userPositiveRecommendations += `<@${element.recommenderDiscordId}> - ${element.reason}\n`;
          else
            userNegativeRecommendations += `<@${element.recommenderDiscordId}> - ${element.reason}\n`;
        });
      }

      if (userPositiveRecommendations === '') {
        userPositiveRecommendations = 'brak';
      }

      if (userNegativeRecommendations === '') {
        userNegativeRecommendations = 'brak';
      }

      if (userData) {
        embed.setDescription(`<@${userData.discordId}>`);
        embed.setTitle('Dane gracza');
        embed.setColor('#0099ff');
        embed.setAuthor({
          name: `${userData.discordTag}`,
          iconURL: `https://cdn.discordapp.com/avatars/${userData.discordId}/${userData.avatar}.jpeg`,
        });
        embed.addFields(
          {
            name: 'Stopień:',
            value: userData.userRank.rank.name,
            inline: true,
          },
          {
            name: 'Korpus',
            value: userData.userRank.rank.corps,
            inline: true,
          },
          { name: '\u200B', value: '\u200B' },
          { name: 'Rekomendacje:', value: userPositiveRecommendations },
          { name: 'Ujemne Rekomendacje:', value: userNegativeRecommendations },
          {
            name: 'Aktualna liczba ',
            value: `${calcCurrentRecommendationNumber(
              userData.recommendationsRecived,
            )}`,
            inline: true,
          },
          {
            name: 'Liczba do awansu',
            value: `${checkRecommendationRequiredToPromote(
              userData.userRank.rank.name,
            )}`,
            inline: true,
          },
          {
            name: 'Gotowy do awansu',
            value: userData.userPromotion.ready ? 'Tak' : 'Nie',
          },
          {
            name: 'Konto aktywne',
            value: userData.accountActive ? 'Tak' : 'Nie',
          },
        );
      } else {
        embed.setDescription('Nie udało się sprawdzić gracza!');
      }

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      if (err?.message) {
        embed.setDescription(err.message);
        await interaction.editReply({ embeds: [embed] });
      } else {
        embed.setDescription('Wystąpił nieoczkiwany błąd!');
        await interaction.editReply({ embeds: [embed] });
        console.error(err);
      }
    }
  }
}
