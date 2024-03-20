import { Param, ParamType } from '@discord-nestjs/core';

export class PlayerShowDto {
  @Param({ description: 'Dodaj gracza', type: ParamType.USER, required: true })
  user: string;
}
