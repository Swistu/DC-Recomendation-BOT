import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository, UpdateResult } from 'typeorm';
import { UserRankEntity } from '../models/userRoles.entity';
import { UserRank } from '../models/userRank.dto';

export class UserRankService {
  constructor(
    @InjectRepository(UserRankEntity)
    private readonly userRankRepository: Repository<UserRankEntity>,
  ) {}

  getUserRankByDiscordId(discordId: any): Observable<UserRankEntity> {
    return from(this.userRankRepository.findOneBy({ discordId: discordId }));
  }

  updateUserRank(discordId: string, dto: UserRank): Observable<UpdateResult>{
    return from(this.userRankRepository.update(discordId, dto));
  }
}
