import { Param, ParamType } from '@discord-nestjs/core';
import { User } from 'discord.js';

export class PlayerShowDto {
  @Param({ description: 'Dodaj gracza', type: ParamType.USER, required: true })
  user: string;
}
