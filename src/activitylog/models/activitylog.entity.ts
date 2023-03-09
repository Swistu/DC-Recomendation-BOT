import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('activitylog')
export class ActivityLogEntity {
  @PrimaryColumn()
  warNumber: number;

  @PrimaryColumn({ type: 'bigint' })
  discordId: string;

  @Column({ type: 'int' })
  enemyPlayerDamage: number;

  @Column({ type: 'int' })
  enemyStructureVehicleDamage: number;

  @Column({ type: 'int' })
  friendlyConstruction: number;

  @Column({ type: 'int' })
  friendlyHealing: number;

  @Column({ type: 'int' })
  friendlyPlayerDamage: number;

  @Column({ type: 'int' })
  friendlyRepairing: number;

  @Column({ type: 'int' })
  friendlyRevivals: number;

  @Column({ type: 'int' })
  friendlyStructureVehicleDamage: number;

  @Column({ type: 'int' })
  materialsGathered: number;

  @Column({ type: 'int' })
  materialsSubmitted: number;

  @Column({ type: 'int' })
  supplyValueDelivered: number;

  @Column({ type: 'int' })
  vehicleSelfDamage: number;

  @Column({ type: 'int' })
  vehiclesCapturedByEnemy: number;
}
