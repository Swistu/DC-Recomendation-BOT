//warehouseCodes.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { WarehouseEntity } from 'src/warehouses/models/warehouses.entity';

@Entity()
export class WarehouseCodeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 6 })
  code: string;

  @ManyToOne(() => WarehouseEntity, (warehouse) => warehouse.warehouseCodes)
  warehouse: WarehouseEntity;
}
