import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { RanksEntity } from '../models/ranks.entity';
import {ServiceOptions} from "../../utility/generalClasses";

export class RanksService {
  constructor(
    @InjectRepository(RanksEntity)
    private readonly rankRepository: Repository<RanksEntity>,

    private dataSource: DataSource,
  ) {}

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
