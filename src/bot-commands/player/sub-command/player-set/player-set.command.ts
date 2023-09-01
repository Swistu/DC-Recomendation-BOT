import { SlashCommandPipe } from '@discord-nestjs/common';
import { Handler, IA, SubCommand } from '@discord-nestjs/core';
import { Inject, Injectable } from '@nestjs/common';
import { PlayerSetDto } from './player-set.dto';
import { CommandInteraction, EmbedBuilder, GuildMember } from 'discord.js';
import { UsersService } from 'src/users/services/users.service';
import { UserRankService } from 'src/userRank/services/userRank.service';
import {
  createUserRankWithRankName,
  setUserRank,
} from 'src/userRank/models/userRank.dto';
import { RankTypes } from 'src/ranks/models/ranks.entity';

@SubCommand({ name: 'ustaw', description: 'ustawia graczowi stopień' })
@Injectable()
export class PlayerSetSubCommand {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
    private readonly userRankSerivce: UserRankService,
  ) {}

  @Handler()
  async onPlayerSet(
    @IA(SlashCommandPipe) dto: PlayerSetDto,
    @IA() interaction: CommandInteraction,
  ) {
    await interaction.reply('Trwa sprawdzanie gracza...');
    const user = interaction.options.getMember('user') as GuildMember;
    if (!user) await interaction.editReply('Podano niewłaściwego gracza.');

    try {
      const intreactionUser = await this.usersService.getUser(user.id);
      if (intreactionUser.userRank.rank.name !== RankTypes.PULKOWNIK) {
        await interaction.editReply('Nie możesz ustawiać rang graczy');
        return;
      }

      const setUserObj: setUserRank = {
        discordId: dto.user,
        rankName: dto.rank as string,
      };
      const updatedUser = await this.userRankSerivce.setUserRank(setUserObj);

      if (!updatedUser.affected)
        await interaction.editReply('Nie zmieniono rangi!');

      await interaction.editReply(
        `Zmieniono stopień gracza <@${dto.user}> na ${dto.rank}!`,
      );
    } catch (err) {
      if (err?.message) {
        await interaction.editReply(err.message);
      } else {
        await interaction.editReply('Wystąpił nieoczekiwany błąd');
      }

      console.error(err);
    }
  }
}
