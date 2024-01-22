// warehouses.controller.ts

import { Controller } from '@nestjs/common';
import { WarehouseService } from 'src/warehouses/services/warehouses.service';

@Controller('warehouses')
export class WarehouseController {
  constructor(private warehouseService: WarehouseService) {}

  // Define endpoints
}
