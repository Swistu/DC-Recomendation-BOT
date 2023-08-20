import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { RecommendationsHistoryEntity } from '../models/recommendationsHistory.entity';

@Injectable()
export class RecommendationsHistoryService {
  constructor(
    @InjectRepository(RecommendationsHistoryEntity)
    private readonly userRankHistoryRepository: Repository<RecommendationsHistoryEntity>,
  ) {}

  getRole(roleId: number){
    return this.userRankHistoryRepository.findOneBy({ id: roleId });
  }
}
