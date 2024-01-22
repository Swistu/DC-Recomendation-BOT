// warehouses.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WarehouseEntity } from 'src/warehouses/models/warehouses.entity';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(WarehouseEntity)
    private warehouseRepository: Repository<WarehouseEntity>,
  ) {}

  // Add methods for CRUD operations
}
