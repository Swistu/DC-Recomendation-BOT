import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLogEntity } from '../models/activitylog.entity';
import { ActivityLogDto } from '../models/activitylog.dto';

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectRepository(ActivityLogEntity)
    private readonly activityLogRepository: Repository<ActivityLogEntity>,
  ) {}

  // async getAllActivityLogs() {
  //   return await this.activityLogRepository.find();
  // }
  async getQueryActivitylogs(discordId?: string, warNumber?: number) {
    try {
      return await this.activityLogRepository.find({
        where: {
          ...(discordId && { discordId }),
          ...(warNumber && { warNumber }),
        },
      });
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      throw new Error('Error fetching activity logs');
    }
  }

  async createActivityLog(activityLogDto: ActivityLogDto) {
    try {
      const activityLog = this.activityLogRepository.create(activityLogDto);
      return await this.activityLogRepository.save(activityLog);
    } catch (error) {
      // Handle error (e.g., log it, rethrow it, etc.)
      console.error('Error creating activity log:', error);
    }
  }
}
