import { Command } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { PlayerShowSubCommand } from './sub-command/player-show.command';

@Command({
  name: 'gracz',
  description: 'Operacje na graczach',
  include: [PlayerShowSubCommand],
})
@Injectable()
export class PlayerCommand {}
