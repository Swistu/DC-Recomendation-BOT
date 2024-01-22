// warehouseCode.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WarehouseCodeEntity } from 'src/warehouseCodes/models/warehouseCodes.entity';

@Injectable()
export class WarehouseCodeService {
  constructor(
    @InjectRepository(WarehouseCodeEntity)
    private warehouseCodeRepository: Repository<WarehouseCodeEntity>,
  ) {}

  // Add methods for CRUD operations
}
