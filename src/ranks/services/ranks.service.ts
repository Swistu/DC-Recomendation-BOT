import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { RanksEntity } from '../models/ranks.entity';

export class RankService {
  constructor(
    @InjectRepository(RanksEntity)
    private readonly rankRepository: Repository<RanksEntity>,
  ) {}

  getRankByName(rankName: string) {
    return this.rankRepository.findOneBy({ name: rankName });
  }

  getRankByOrderNumber( orderNumber: number) {
    return this.rankRepository.findOneBy({ number: orderNumber });
  }
}
