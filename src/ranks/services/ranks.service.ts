import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { RanksEntity } from '../models/ranks.entity';
import { ServiceOptions } from 'src/utility/generalClasses';
import { CreateRankDto } from '../models/ranks.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RanksService {
  constructor(
    @InjectRepository(RanksEntity)
    private readonly rankRepository: Repository<RanksEntity>,

    private dataSource: DataSource,
  ) {}

  async createRank(rank: CreateRankDto, options?: ServiceOptions) {
    const newRank = this.rankRepository.create({ ...rank });
    return await this.rankRepository.save(newRank);
  }

  async getAllRanks(options?: ServiceOptions) {
    const entityManager =
      options?.entityManager || this.dataSource.createQueryRunner().manager;
    return await entityManager.find(RanksEntity);
  }

  async getRankByName(rankName: string) {
    return await this.rankRepository.findOneBy({ name: rankName });
  }

  async getRankByOrderNumber(orderNumber: number) {
    return await this.rankRepository.findOneBy({ number: orderNumber });
  }
}
