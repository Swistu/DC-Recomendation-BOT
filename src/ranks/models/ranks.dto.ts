export class RanksDto {
  id: string;
  numberToPromote: number;
  order: number;
  rank: string;
  corps: string;
}
export class CreateRankDto {
  number: number;
  order: number;
  name: string;
  corps: string;
}
