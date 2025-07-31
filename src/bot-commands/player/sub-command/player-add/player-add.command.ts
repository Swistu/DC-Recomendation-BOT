import { SlashCommandPipe } from '@discord-nestjs/common';
import { Handler, InteractionEvent, SubCommand } from '@discord-nestjs/core';
import { PlayerAddDto } from './player-add.dto';
import { Inject, Injectable } from '@nestjs/common';
import { CommandInteraction, EmbedBuilder, GuildMember } from 'discord.js';
import { UsersService } from 'src/users/services/users.service';
import { UserRole } from 'src/userRoles/models/userRole.dto';
import { UserExistsError } from 'src/utility/errorTypes';

@SubCommand({ name: 'dodaj', description: 'pokazuje infromacje o graczu' })
@Injectable()
export class PlayerAddSubCommand {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
  ) {}

  @Handler()
  async onBaseInfo(
    @InteractionEvent(SlashCommandPipe) dto: PlayerAddDto,
    @InteractionEvent() interaction: CommandInteraction,
  ) {
    const user = interaction.member as GuildMember;

    if (!user) {
      await interaction.editReply('Podano niewłaściwego gracza.');
      return;
    }

    const embed = new EmbedBuilder().setDescription('Trwa sprawdzanie gracza!');
    await interaction.reply({ embeds: [embed], ephemeral: false });

    try {
      const createUser = await this.usersService.createUser({
        discordId: user.user.id,
        roleId: UserRole.MEMBER,
      });

      if (createUser) {
        embed.setDescription('Dodano gracza do bazy!');
      } else {
        embed.setDescription('Nie udało się dodać gracza do bazy!');
      }
    } catch (err) {
      if (err instanceof UserExistsError) {
        embed.setDescription(err.message);
        await interaction.editReply({ embeds: [embed] });
      } else {
        console.error(err);
        throw err;
      }
    }

    await interaction.editReply({ embeds: [embed] });
  }
}
