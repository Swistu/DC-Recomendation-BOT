import { Param, Choice, ParamType } from '@discord-nestjs/core';

enum City {
  'Moscow',
  'New York',
  'Tokyo',
}
export class PlayerShowDto {
  @Param({ description: 'User name', required: true })
  name: string;

  @Param({ description: 'User age', required: true, type: ParamType.INTEGER })
  age: number;

  @Choice(City)
  @Param({ description: 'User city', type: ParamType.INTEGER })
  city: City;
}
