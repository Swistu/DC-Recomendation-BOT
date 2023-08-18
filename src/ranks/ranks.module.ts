import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RanksEntity } from './models/ranks.entity';
import { RankController } from './controllers/ranks.controller';
import { RankService } from './services/ranks.service';

@Module({
  imports: [TypeOrmModule.forFeature([RanksEntity])],
  controllers: [RankController],
  providers: [RankService]
})
export class RanksModule { }
