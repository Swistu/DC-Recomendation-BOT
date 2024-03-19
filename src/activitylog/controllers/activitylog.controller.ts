import {Body, Controller, Get, Post} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ActivityLogDto } from '../models/activitylog.dto';
import { ActivityLogService } from '../services/activitylog.service';

@Controller('activitylog')
export class ActivityLogController {
  constructor(private activityLogService: ActivityLogService) {}

  @Get()
  getAll(): Observable<ActivityLogDto[]> {
    return this.activityLogService.getAllActivityLogs();
  }

  @Post()
  create(@Body() activityLog: ActivityLogDto): Observable<ActivityLogDto[]> {
    this.activityLogService.createAllActivityLogs(activityLog);
    return null;
  }
}
