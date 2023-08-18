import { SlashCommandPipe } from "@discord-nestjs/common";
import { Handler, IA, InteractionEvent, SubCommand } from "@discord-nestjs/core";
import { PlayerAddDto } from "./player-add.dto";
import { Inject, Injectable } from "@nestjs/common";
import { CommandInteraction, EmbedBuilder, GuildMember, InteractionCollector, InteractionReplyOptions } from "discord.js";
import { UsersService } from "src/users/services/users.service";
import { UserRole } from "src/userRoles/models/userRole.dto";

@SubCommand({ name: 'dodaj', description: 'pokazuje infromacje o graczu' })
@Injectable()
export class PlayerAddSubCommand {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService

  ) { }

  @Handler()
  async onBaseInfo(@InteractionEvent(SlashCommandPipe) dto: PlayerAddDto, @InteractionEvent() interaction: CommandInteraction) {
    const user = interaction.options.getMember('user') as GuildMember;

    if (!user) {
      await interaction.editReply('Podano niewłaściwego gracza.');
      return;
    }

    const embed = new EmbedBuilder().setDescription('Trwa sprawdzanie gracza!');
    await interaction.reply({ embeds: [embed], ephemeral: false });

    const createUser = await this.usersService.createUser({ discordId: user.user.id, roleId: UserRole.MEMBER })

    if(createUser){
      embed.setDescription('Dodano gracza do bazy!');
    }else{
      embed.setDescription('Nie udało się dodać gracza do bazy!');
    }

    await interaction.editReply({ embeds: [embed] });

    return;
  }
}
