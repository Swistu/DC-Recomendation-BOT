// warehouseCodes.controller.ts

import { Controller } from '@nestjs/common';
import { WarehouseCodeService } from 'src/warehouseCodes/services/warehouseCodes.service';

@Controller('warehouse-codes')
export class WarehouseCodeController {
  constructor(private warehouseCodeService: WarehouseCodeService) {}

  // Define endpoints
}
