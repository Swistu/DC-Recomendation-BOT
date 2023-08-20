import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { RecommendationsEntity } from '../models/recommendations.entity';
import { UsersEntity } from 'src/users/models/users.entity';
import { GiveRecommendationDto, RecommendationsTypes } from '../models/recommendations.dto';

export class RecommendationsService {
  constructor(
    @InjectRepository(RecommendationsEntity)
    private readonly recommendationsRepository: Repository<RecommendationsEntity>,

    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
  ) { }

  async getUserRecommendations(discordId: string) {
    const userRecommendations = await this.userRepository.find({
      where: {
        discord_id: discordId
      },
      relations: { recommendations_recived: true }
    });

    return userRecommendations;
  }

  async giveUserRecommendation(giveRecommendationDto: GiveRecommendationDto) {
    const newRecommendation = this.recommendationsRepository.create({
      reason: giveRecommendationDto.reason,
      type: giveRecommendationDto.type,
      recommended_discord_id: giveRecommendationDto.recommendedDiscordId,
      recommender_discord_id: giveRecommendationDto.recommenderDiscordId,
    })

    return await this.recommendationsRepository.save(newRecommendation);
  }
}
