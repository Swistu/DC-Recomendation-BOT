import { SlashCommandPipe } from '@discord-nestjs/common';
import { Handler, IA, SubCommand } from '@discord-nestjs/core';
import { Inject, Injectable } from '@nestjs/common';
import { PlayerShowDto } from './player-show.dto';
import { CommandInteraction, EmbedBuilder, GuildMember } from 'discord.js';
import { UsersService } from 'src/users/services/users.service';

@SubCommand({ name: 'pokaż', description: 'pokazuje infromacje o graczu' })
@Injectable()
export class PlayerShowSubCommand {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService

  ) { }

  @Handler()
  async onPlayerShow(@IA(SlashCommandPipe) dto: PlayerShowDto, @IA() interaction: CommandInteraction) {
    const user = interaction.options.getMember('user') as GuildMember;

    if (!user) {
      await interaction.editReply('Podano niewłaściwego gracza.');
      return;
    }

    const embed = new EmbedBuilder().setDescription('Trwa sprawdzanie gracza!');
    await interaction.reply({ embeds: [embed], ephemeral: false });

    const userData = await this.usersService.getUser(user.id)

    if (userData) {
      embed.setDescription(`<@${userData.discord_id}>`);
      embed.setTitle('Dane gracza');
      embed.setColor('#0099ff');
      embed.setAuthor({
        name: `${userData.discordTag}`,
        iconURL: `https://cdn.discordapp.com/avatars/${userData.discord_id}/${userData.avatar}.jpeg`
      })
      embed.addFields(
        { name: 'Stopień:', value: userData.userRank.rank.name, inline: true },
        { name: 'Korpus', value: userData.userRank.rank.corps, inline: true },
        { name: '\u200B', value: '\u200B' },
        { name: 'Rekomendacje:', value: '2' },
        { name: 'Ujemne Rekomendacje:', value: '2' },
        { name: 'Całkowita liczba rekomendacji', value: `2` },
        { name: 'Aktualna liczba ', value: `0`, inline: true },
        { name: 'Liczba do awansu', value: `0`, inline: true },
        { name: 'Gotowy do awansu', value: `0` },
        { name: 'Konto aktywne', value: userData.account_active ? 'Tak' : 'Nie'}
      )
    } else {
      embed.setDescription('Nie udało się sprawdzić gracza!');
    }

    await interaction.editReply({ embeds: [embed] });

    return;
  }
}
