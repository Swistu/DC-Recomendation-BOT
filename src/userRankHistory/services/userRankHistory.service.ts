import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { UserRankHistoryEntity } from '../models/userRankHistory.entity';
import { Injectable } from '@nestjs/common';
import { RecommendationsEntity } from 'src/recommendations/models/recommendations.entity';
import { RecommendationsService } from 'src/recommendations/service/recommendations.service';
import { saveUserDto } from '../models/userRankHistory.dto';

@Injectable()
export class UserRankHistoryService {
  constructor(
    @InjectRepository(UserRankHistoryEntity)
    private readonly userRankHistoryRepository: Repository<UserRankHistoryEntity>,

    private readonly recommendationsService: RecommendationsService,
  ) {}

  getRole(roleId: number){
    return from(this.userRankHistoryRepository.findOneBy({ id: roleId }));
  }

  async saveUserHistory(saveUserDto: saveUserDto){
    const userRecommendations = await this.recommendationsService.getUserRecommendations(saveUserDto.discordId);
    console.log(userRecommendations);

    return userRecommendations[0];
  }
}
