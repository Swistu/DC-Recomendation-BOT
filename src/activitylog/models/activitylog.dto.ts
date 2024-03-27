import {IsNumber, IsString, Length, MinLength} from "class-validator";

export class ActivityLogDto {
  @IsNumber()
  // @MinLength(3)
  warNumber: number;
  //todo @IsDiscordId - custom
  @Length(16, 16)
  discordId: string;

  EnemyPlayerDamage?: number;
  EnemyStructureVehicleDamage?: number;
  FriendlyConstruction?: number;
  FriendlyHealing?: number;
  FriendlyPlayerDamage?: number;
  FriendlyRepairing?: number;
  FriendlyRevivals?: number;
  FriendlyStructureVehicleDamage?: number;
  MaterialsGathered?: number;
  MaterialsSubmitted?: number;
  SupplyValueDelivered?: number;
  VehicleSelfDamage?: number;
  VehiclesCapturedByEnemy?: number;
}
