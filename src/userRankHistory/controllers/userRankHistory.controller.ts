import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRankHistoryEntity } from '../models/userRankHistory.entity';
import { UserRankHistoryService } from '../services/userRankHistory.service';
import { saveUserDto } from '../models/userRankHistory.dto';

@Controller('userRankHistory')
export class UserRankHistoryController {
  constructor(private userRankHistoryService: UserRankHistoryService) { }

  @Get('')
  gettest(@Param('id') id: number) {
    return 'elo';
  }

  @Get(':id')
  getRole(@Param('id') id: number): Observable<UserRankHistoryEntity> {
    return this.userRankHistoryService.getRole(id);
  }

  @Post()
  saveUserHistory(@Body() saveUserDto: saveUserDto) {
    return this.userRankHistoryService.saveUserHistory(saveUserDto);
  }
}
