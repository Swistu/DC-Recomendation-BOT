import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository, UpdateResult } from 'typeorm';
import { UserRankEntity } from '../models/userRank.entity';
import { createUserRankWithId, createUserRankWithOrderNumber, createUserRankWithRankName, UserRank } from '../models/userRank.dto';
import { RanksEntity } from 'src/ranks/models/ranks.entity';
import { UsersService } from 'src/users/services/users.service';
import { UsersEntity } from 'src/users/models/users.entity';

export class UserRankService {
  constructor(
    @InjectRepository(UserRankEntity)
    private readonly userRankRepository: Repository<UserRankEntity>,
    @InjectRepository(RanksEntity)
    private readonly rankRepository: Repository<RanksEntity>,
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) { }

  getUserRankByDiscordId(discordId: any) {
    return this.userRankRepository.findOneBy({ discord_id: discordId });
  }

  async createUserRank(createUserRankDto: createUserRankWithId | createUserRankWithOrderNumber | createUserRankWithRankName) {
    const { discordId, rankId, rankName, rankOrderNumber } = createUserRankDto;
    const user = await this.usersRepository.findOneBy({
      discord_id: discordId
    })

    if (!user) {
      return;
    }

    let rank: RanksEntity;
    if (rankId !== undefined) {
      rank = await this.rankRepository.findOneBy({
        id: rankId
      })
    } else if (rankName !== undefined) {
      rank = await this.rankRepository.findOneBy({
        name: rankName
      })
    } else if (rankOrderNumber !== undefined) {
      rank = await this.rankRepository.findOneBy({
        order: rankOrderNumber
      })
    }

    if (!rank) {
      const error = new Error();
      error.name = "RankNotFound";
      error.message = `Rank was not found`;
      throw error;
    }

    const userRank = this.userRankRepository.create({
      discord_id: discordId,
      rank: rank
    })

    if (!userRank) {
      const error = new Error();
      error.name = "UserRankNotCreated";
      error.message = `Cannot create user rank`;
      throw error;
    }


    const savedUserRank = await this.userRankRepository.save(userRank);
    const userUpdated = this.usersRepository.create({
      discord_id: discordId,
      userRank: userRank
    });

    await this.usersRepository.save(userUpdated);
    return savedUserRank;
  }
}
