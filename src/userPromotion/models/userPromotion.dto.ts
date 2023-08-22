export class UpdatePromotionDto {
  ready?: boolean;
  blocked?: boolean;
}

export class CreatePromotionDto {
  ready: boolean;
  blocked: boolean;
}

export class UpdateUserPromotionDto extends UpdatePromotionDto {
  discordId: string;
}

export class CreateUserPromotionDto extends CreatePromotionDto {
  discordId: string;
}

export class UserPromotionList {
  discordId: string;
  currentRankOrder: number;
  currentRankNumber: number;
  currentRankName: string;
  currentRankCorps: string;
  newRankOrder: number;
  newRankNumber: number;
  newRankName: string;
  newRankCorps: string;
}