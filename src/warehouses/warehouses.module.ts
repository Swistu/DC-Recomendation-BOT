import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseService } from './services/warehouses.service';
import { WarehouseController } from './controllers/warehouses.controller';
import { WarehouseEntity } from 'src/warehouses/models/warehouses.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WarehouseEntity])],
  providers: [WarehouseService],
  controllers: [WarehouseController],
})
export class WarehouseModule {}
