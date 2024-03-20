import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRankHistoryEntity } from './models/userRankHistory.entity';
import { UserRankHistoryController } from './controllers/userRankHistory.controller';
import { UserRankHistoryService } from './services/userRankHistory.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRankHistoryEntity])],
  providers: [UserRankHistoryService],
  controllers: [UserRankHistoryController],
  exports: [UserRankHistoryService],
})
export class UserRankHistoryModule {}
