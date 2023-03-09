import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogController } from './controllers/activitylog.controller';
import { ActivityLogEntity } from './models/activitylog.entity';
import { ActivityLogService } from './services/activitylog.service';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityLogEntity])],
  providers: [ActivityLogService],
  controllers: [ActivityLogController],
})
export class ActivityLogModule {}
