import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from } from 'rxjs';
import { Repository } from 'typeorm';
import { ActivityLogEntity } from '../models/activitylog.entity';

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectRepository(ActivityLogEntity)
    private readonly activityLogRepository: Repository<ActivityLogEntity>,
  ) {}

  getAllActivityLogs() {
    return from(this.activityLogRepository.find());
  }
}
