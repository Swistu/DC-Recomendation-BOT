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
  async onBaseInfo(@InteractionEvent(SlashCommandPipe) dto: PlayerAddDto, @InteractionEvent() interaction: CommandInteraction): Promise<void> {
    const user = interaction.options.getMember('user') as GuildMember;

    if (!user) {
      interaction.editReply('Podano niewłaściwego gracza.');
      return;
    }

    const userDatabase = await this.usersService.getUserDatabaseData(user.user.id);

    console.log('database', userDatabase);

    console.log(user.user.id);
    console.log(interaction.user.id);
    const embed = new EmbedBuilder().setDescription('Pong!');
    interaction.reply({ embeds: [embed], ephemeral: false });

    this.usersService.createUser({ discordId: user.user.id, roleId: UserRole.MEMBER })

    return;
  }
}
