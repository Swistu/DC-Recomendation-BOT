import { Choice, Param, ParamType } from '@discord-nestjs/core';

enum RecommendationType {
  Dodatnia = 1,
  Ujemna = 0,
}

export class RecommendationRemoveDto {
  @Param({ description: 'Gracz', type: ParamType.USER, required: true })
  user: string;

  @Choice(RecommendationType)
  @Param({ description: 'Typ', type: ParamType.INTEGER, required: true })
  type: RecommendationType;
}
