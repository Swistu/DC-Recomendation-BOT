import { Choice, Param, ParamType } from '@discord-nestjs/core';
import { RankTypes } from '../ranks/models/ranks.entity';

export class PlayerSetDto {
  @Param({ description: 'Gracz', type: ParamType.USER, required: true })
  user: string;

  @Choice(RankTypes)
  @Param({ description: 'Stopień', type: ParamType.STRING, required: true })
  rank: RankTypes;
}
