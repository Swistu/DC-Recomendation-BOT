import { Command } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { PlayerShowSubCommand } from './sub-command/player-show/player-show.command';
import { PlayerAddSubCommand } from './sub-command/player-add/player-add.command';

@Command({
  name: 'gracz',
  description: 'Operacje na graczach',
  include: [PlayerShowSubCommand, PlayerAddSubCommand],
})

@Injectable()
export class PlayerCommand {}
