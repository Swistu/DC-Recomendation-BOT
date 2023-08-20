import { Controller, Get, Param } from '@nestjs/common';
import { RecommendationsService } from '../service/recommendations.service';

@Controller('recommendations')
export class RecommendationsController {
  constructor(
    private recommendaationsService: RecommendationsService
  ) { }

  @Get(':id')
  getUserRecommendations(@Param('id') discordId: 'string') {
    return this.recommendaationsService.getUserRecommendations(discordId);
  }

}
