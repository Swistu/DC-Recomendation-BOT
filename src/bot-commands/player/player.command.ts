import { Command } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { PlayerShowSubCommand } from './sub-command/player-show/player-show.command';
import { PlayerAddSubCommand } from './sub-command/player-add/player-add.command';
import { PlayerSetSubCommand } from './sub-command/player-set/player-set.command';

@Command({
  name: 'gracz',
  description: 'Operacje na graczach',
  include: [PlayerShowSubCommand, PlayerAddSubCommand, PlayerSetSubCommand],
})
@Injectable()
export class PlayerCommand {}
