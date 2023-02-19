import { SlashCommandPipe } from '@discord-nestjs/common';
import { Handler, IA, SubCommand } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { PlayerShowDto } from './player-show.dto';

@SubCommand({ name: 'pokazuj', description: 'pokazuje infromacje o graczu' })
@Injectable()
export class PlayerShowSubCommand {
  @Handler()
  onPlayerShow(@IA(SlashCommandPipe) dto: PlayerShowDto): string {
    return `Siema ${dto.name} - ${dto.city} - ${dto.age}`;
  }
}
