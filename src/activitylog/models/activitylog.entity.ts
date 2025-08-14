import { UsersEntity } from 'src/users/models/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('activitylog')
export class ActivityLogEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'war_number' })
  id: number;

  @Column({ type: 'int', name: 'war_number' })
  warNumber: number;

  @ManyToOne(() => UsersEntity, (user) => user.discord_id)
  @JoinColumn({ name: 'discord_id' })
  @PrimaryColumn()
  @Column({ type: 'bigint', name: 'discord_id' })
  discordId: string;

  @Column({ type: 'int', name: 'enemy_player_damage' })
  enemyPlayerDamage: number;

  @Column({ type: 'int', name: 'enemy_structure_vehicle_damage' })
  enemyStructureVehicleDamage: number;

  @Column({ type: 'int', name: 'friendly_construction' })
  friendlyConstruction: number;

  @Column({ type: 'int', name: 'friendly_healing' })
  friendlyHealing: number;

  @Column({ type: 'int', name: 'friendly_player_damage' })
  friendlyPlayerDamage: number;

  @Column({ type: 'int', name: 'friendly_repairing' })
  friendlyRepairing: number;

  @Column({ type: 'int', name: 'friendly_revivals' })
  friendlyRevivals: number;

  @Column({ type: 'int', name: 'friendly_structure_vehicle_damage' })
  friendlyStructureVehicleDamage: number;

  @Column({ type: 'int', name: 'materials_gathered' })
  materialsGathered: number;

  @Column({ type: 'int', name: 'materials_submitted' })
  materialsSubmitted: number;

  @Column({ type: 'int', name: 'supply_value_delivered' })
  supplyValueDelivered: number;

  @Column({ type: 'int', name: 'vehicle_self_damage_neutral' })
  vehicleSelfDamageNeutral: number;

  @Column({ type: 'int', name: 'vehicle_self_damage_colonial' })
  vehicleSelfDamageColonial: number;

  @Column({ type: 'int', name: 'vehicle_self_damage_warden' })
  vehicleSelfDamageWarden: number;

  @Column({ type: 'int', name: 'vehicles_captured_by_enemy' })
  vehiclesCapturedByEnemy: number;
}
