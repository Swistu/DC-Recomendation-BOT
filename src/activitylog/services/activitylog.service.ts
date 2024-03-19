import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from } from 'rxjs';
import { Repository } from 'typeorm';
import { ActivityLogEntity } from '../models/activitylog.entity';
import { ActivityLogDto } from "../models/activitylog.dto";

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectRepository(ActivityLogEntity)
    private readonly activityLogRepository: Repository<ActivityLogEntity>,
  ) {}

  getAllActivityLogs() {
    return from(this.activityLogRepository.find());
  }

  createAllActivityLogs(activityLog: ActivityLogDto) {
    return from(this.activityLogRepository.save(activityLog));
  }
}
