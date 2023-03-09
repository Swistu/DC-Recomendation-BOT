export class ActivityLogDto {
  warNumber: number;
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
