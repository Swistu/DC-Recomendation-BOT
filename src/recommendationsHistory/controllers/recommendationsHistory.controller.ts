import { Controller, Get, Param } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RecommendationsHistoryService } from '../service/recommendationsHistory.service';

@Controller('recommendationsHistory')
export class RecommendationsHistoryController {
  constructor(
    private recommendationsHistoryService: RecommendationsHistoryService,
  ) {}

  @Get('')
  gettest(@Param('id') id: number) {
    return 'elo';
  }

  @Get(':id')
  getRole(@Param('id') id: number) {
    return this.recommendationsHistoryService.getRole(id);
  }
}
