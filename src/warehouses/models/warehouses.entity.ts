// warehouses.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { WarehouseCodeEntity } from 'src/warehouseCodes/models/warehouseCodes.entity';

@Entity()
export class WarehouseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  createDate: Date;

  @Column()
  createdByUser: bigint;

  @Column({ length: 45 })
  name: string;

  @Column()
  expirationDate: Date;

  @Column()
  refreshedDate: Date;

  @OneToMany(
    () => WarehouseCodeEntity,
    (warehouseCode) => warehouseCode.warehouse,
  )
  warehouseCodes: WarehouseCodeEntity[];
}
