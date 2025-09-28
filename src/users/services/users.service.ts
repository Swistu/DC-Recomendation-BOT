import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { UsersEntity } from '../models/users.entity';
import { CreateUser, User } from '../models/user.dto';
import { InjectDiscordClient } from '@discord-nestjs/core';
import { Client } from 'discord.js';
import { UserRolesEntity } from 'src/userRoles/models/userRoles.entity';
import { UserRankService } from 'src/userRank/services/userRank.service';
import { createUserRankWithOrderNumber } from 'src/userRank/models/userRank.dto';
import { UserPromotionService } from 'src/userPromotion/services/userPromotion.service';
import { UserDontExistError, UserExistsError } from 'src/utility/errorTypes';

@Injectable()
export class UsersService {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,

    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    @InjectRepository(UserRolesEntity)
    private readonly userRolesRepository: Repository<UserRolesEntity>,

    private dataSource: DataSource,
    private userRankService: UserRankService,
    private userPromotionService: UserPromotionService,
  ) {}

  async createUser(user: CreateUser) {
    const { discordId, roleName, accountactive } = user;
    let savedUser: undefined | UsersEntity;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existUser = await this.usersRepository.findOneBy({
        discordId: discordId,
      });
      if (existUser) {
        throw new UserExistsError(
          `Użytkownik <@${discordId}> już istnieje w bazie.`,
        );
      }

      const userRole = await this.userRolesRepository.findOneBy({
        name: roleName,
      });

      if (!userRole) {
        throw new Error('No userRole was found');
      }

      const newUser = this.usersRepository.create({
        accountActive: accountactive,
        discordId: discordId,
        role: userRole,
      });
      savedUser = await this.usersRepository.save(newUser);

      const userRank = await this.userRankService.createUserRank({
        discordId: discordId,
        rankOrderNumber: 1,
      } as createUserRankWithOrderNumber);

      if (!userRank) {
        return;
      }

      await this.userPromotionService.createUserPromotion({
        discordId: discordId,
        blocked: false,
        ready: false,
      });
    } catch (err) {
      await queryRunner.rollbackTransaction();

      if (err instanceof UserExistsError) {
        throw new UserExistsError(err.message);
      } else {
        console.error(err);
      }
    } finally {
      await queryRunner.release();
    }

    return savedUser;
  }

  async getUser(discordId: string) {
    try {
      const userDatabaseData = await this.getUserDatabaseData(discordId);
      const userDiscordData = await this.getUserDiscordData(discordId);

      if (!userDatabaseData || !userDiscordData) {
        throw new UserDontExistError();
      }

      const user = {
        ...userDatabaseData,
        ...userDiscordData,
        discordTag:
          userDiscordData.user.username +
          '#' +
          userDiscordData.user.discriminator,
      };

      return user;
    } catch (err) {
      if (err instanceof UserDontExistError) {
        throw new UserDontExistError(err.message);
      }

      console.error();
    }
  }

  getAllUsers() {
    return this.getAllUsersDatabaseData();
  }

  updateUser(discordId: string, user: User) {
    return this.usersRepository.update(discordId, user);
  }

  deleteUser(discordId: string) {
    return this.usersRepository.delete(discordId);
  }

  // Helper functions
  async getAllUsersDatabaseData() {
    const userDatabaseData = await this.usersRepository.find({
      relations: {
        role: true,
        userRank: {
          rank: true,
        },
      },
    });

    return userDatabaseData;
  }

  async getUserDatabaseData(discordId: string) {
    const userDatabaseData = await this.usersRepository.findOne({
      where: {
        discordId: discordId,
      },
      relations: {
        role: true,
        userRank: {
          rank: true,
        },
        userPromotion: true,
        recommendationsRecived: true,
        recommendationsGiven: true,
      },
    });

    return userDatabaseData;
  }

  async getUserDiscordData(discordId: string) {
    const guild = await this.client.guilds.fetch(process.env.DISCORD_GUILD_ID);
    const userDiscordData = await guild.members.fetch(discordId);

    return userDiscordData;
  }
}
