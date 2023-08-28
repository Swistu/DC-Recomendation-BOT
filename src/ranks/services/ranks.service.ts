import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { RanksEntity } from '../models/ranks.entity';

export class RanksService {
  constructor(
    @InjectRepository(RanksEntity)
    private readonly rankRepository: Repository<RanksEntity>,
  ) {}

  async getAllRanks(){
    return await this.rankRepository.find();
  }
  
  async getRankByName(rankName: string) {
    return await this.rankRepository.findOneBy({ name: rankName });
  }

  async getRankByOrderNumber( orderNumber: number) {
    return await this.rankRepository.findOneBy({ number: orderNumber });
  }
}
