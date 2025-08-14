import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ActivityLogService } from '../services/activitylog.service';
import { ActivityLogDto } from '../models/activitylog.dto';

@Controller('activitylog')
export class ActivityLogController {
  constructor(private activityLogService: ActivityLogService) {}

  // @Get()
  // async getAll() {
  //   return await this.activityLogService.getAllActivityLogs();
  // }

  @Get()
  async getQueryActivitylogs(
    @Query('discord_id') discordId?: string,
    @Query('war_number') warNumber?: number,
  ) {
    return await this.activityLogService.getQueryActivitylogs(
      discordId,
      warNumber,
    );
  }

  @Post()
  async createActivityLog(@Body() activityLogDto: ActivityLogDto) {
    // Logic to create a new activity log entry
    // This would typically involve validating the DTO and saving it to the database
    return await this.activityLogService.createActivityLog(activityLogDto);
  }
}
