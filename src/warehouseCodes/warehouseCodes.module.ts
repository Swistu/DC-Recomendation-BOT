// warehouse-code.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseCodeService } from './services/warehouseCodes.service';
import { WarehouseCodeController } from './controllers/warehouseCodes.controller';
import { WarehouseCodeEntity } from 'src/warehouseCodes/models/warehouseCodes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WarehouseCodeEntity])],
  providers: [WarehouseCodeService],
  controllers: [WarehouseCodeController],
})
export class WarehouseCodeModule {}
