export class UpdatePromotionSettingsDto {
  ready?: boolean;
  blocked?: boolean;
}

export class CreatePromotionSettingsDto {
  ready: boolean;
  blocked: boolean;
}

export class UpdateUserPromotionSettingsDto extends UpdatePromotionSettingsDto {
  discordId: string;
}

export class CreateUserPromotionSettingsDto extends CreatePromotionSettingsDto {
  discordId: string;
}
