import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RanksEntity } from './models/ranks.entity';
import { RanksController } from './controllers/ranks.controller';
import { RanksService } from './services/ranks.service';

@Module({
  imports: [TypeOrmModule.forFeature([RanksEntity])],
  controllers: [RanksController],
  providers: [RanksService],
  exports: [RanksService],
})
export class RanksModule {}
