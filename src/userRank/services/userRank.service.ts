import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRankEntity } from '../models/userRank.entity';
import {
  createUserRankWithId,
  createUserRankWithOrderNumber,
  createUserRankWithRankName,
  setUserRank,
} from '../models/userRank.dto';
import { RanksEntity } from 'src/ranks/models/ranks.entity';
import { UsersEntity } from 'src/users/models/users.entity';
import { RankDontExistError, UserDontExistError } from 'src/utility/errorTypes';

export class UserRankService {
  constructor(
    @InjectRepository(UserRankEntity)
    private readonly userRankRepository: Repository<UserRankEntity>,
    @InjectRepository(RanksEntity)
    private readonly rankRepository: Repository<RanksEntity>,
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  getUserRankByDiscordId(discordId: any) {
    return this.userRankRepository.findOneBy({ discord_id: discordId });
  }

  async createUserRank(
    createUserRankDto:
      | createUserRankWithId
      | createUserRankWithOrderNumber
      | createUserRankWithRankName,
  ) {
    const { discordId, rankId, rankName, rankOrderNumber } = createUserRankDto;
    const user = await this.usersRepository.findOneBy({
      discord_id: discordId,
    });

    if (!user) {
      return;
    }

    let rank: RanksEntity;
    if (rankId !== undefined) {
      rank = await this.rankRepository.findOneBy({
        id: rankId,
      });
    } else if (rankName !== undefined) {
      rank = await this.rankRepository.findOneBy({
        name: rankName,
      });
    } else if (rankOrderNumber !== undefined) {
      rank = await this.rankRepository.findOneBy({
        order: rankOrderNumber,
      });
    }

    if (!rank) {
      const error = new Error();
      error.name = 'RankNotFound';
      error.message = `Rank was not found`;
      throw error;
    }

    const userRank = this.userRankRepository.create({
      discord_id: discordId,
      rank: rank,
    });

    if (!userRank) {
      const error = new Error();
      error.name = 'UserRankNotCreated';
      error.message = `Cannot create user rank`;
      throw error;
    }

    const savedUserRank = await this.userRankRepository.save(userRank);
    const userUpdated = this.usersRepository.create({
      discord_id: discordId,
      user_rank: userRank,
    });

    await this.usersRepository.save(userUpdated);
    return savedUserRank;
  }

  async setUserRank(setUserRankDto: setUserRank) {
    const { discordId, rankName } = setUserRankDto;

    try {
      const userRank = await this.userRankRepository.findOneBy({
        discord_id: discordId,
      });
      if (!userRank)
        throw new UserDontExistError(`Nie znaleziono <@${discordId}> w bazie`);

      const newRank = await this.rankRepository.findOneBy({ name: rankName });
      if (!newRank)
        throw new RankDontExistError(`Nie znaleziono rangi ${rankName}`);

      const updatedUser = await this.userRankRepository.update(
        { discord_id: discordId },
        { rank: newRank },
      );

      return updatedUser;
    } catch (err) {
      if (err instanceof UserDontExistError)
        throw new UserDontExistError(err.message);
      else if (err instanceof RankDontExistError)
        throw new RankDontExistError(err.message);

      console.error(err);
    }
  }
}
