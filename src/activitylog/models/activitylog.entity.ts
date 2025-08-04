import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('activitylog')
export class ActivityLogEntity {
  @PrimaryColumn()
  warNumber: number;

  @PrimaryColumn({ type: 'bigint' })
  discordId: string;

  @Column({ type: 'int' })
  enemy_player_damage: number;

  @Column({ type: 'int' })
  enemy_structure_vehicle_damage: number;

  @Column({ type: 'int' })
  friendly_construction: number;

  @Column({ type: 'int' })
  friendly_healing: number;

  @Column({ type: 'int' })
  friendly_player_damage: number;

  @Column({ type: 'int' })
  friendly_repairing: number;

  @Column({ type: 'int' })
  friendly_revivals: number;

  @Column({ type: 'int' })
  friendly_structure_vehicle_damage: number;

  @Column({ type: 'int' })
  materials_gathered: number;

  @Column({ type: 'int' })
  materials_submitted: number;

  @Column({ type: 'int' })
  supply_value_delivered: number;

  @Column({ type: 'int' })
  vehicle_self_damage: number;

  @Column({ type: 'int' })
  vehicles_captured_by_enemy: number;
}
