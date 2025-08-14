export class ActivityLogDto {
  warNumber: number;
  discordId: string;
  enemyPlayerDamage?: number;
  enemyStructureVehicleDamage?: number;
  friendlyConstruction?: number;
  friendlyHealing?: number;
  friendlyPlayerDamage?: number;
  friendlyRepairing?: number;
  friendlyRevivals?: number;
  friendlyStructureVehicleDamage?: number;
  materialsGathered?: number;
  materialsSubmitted?: number;
  supplyValueDelivered?: number;
  vehicleSelfDamageNeutral?: number;
  vehicleSelfDamageColonial?: number;
  vehicleSelfDamageWarden?: number;
  vehiclesCapturedByEnemy?: number;
}
