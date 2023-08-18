import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  combineLatest,
  firstValueFrom,
  from,
  map,
  mergeMap,
  of,
  switchMap,
  toArray,
} from 'rxjs';
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm';

import { UsersEntity } from '../models/users.entity';
import { CreateUser, User } from '../models/user.dto';
import { InjectDiscordClient } from '@discord-nestjs/core';
import { Client, GuildMember } from 'discord.js';
import { UserRolesEntity } from 'src/userRoles/models/userRoles.entity';
import { RanksEntity } from 'src/ranks/models/ranks.entity';
import { UserRankService } from 'src/userRank/services/userRank.service';
import { createUserRankWithOrderNumber } from 'src/userRank/models/userRank.dto';

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
    private userRankService: UserRankService
  ) { }

  async createUser(user: CreateUser) {
    const { discordId, roleId, accountactive } = user;
    const queryRunner = this.dataSource.createQueryRunner();
    let savedUser;

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userRole = await this.userRolesRepository.findOneBy({
        id: roleId
      });

      if (!userRole) {
        throw new Error('No userRole was found');
      }
      const existUser = await this.usersRepository.findOneBy({ discord_id: discordId })
      if (existUser) {
        const error = new Error();
        error.name = "UserExist";
        error.message = `User with discord_id ${discordId} already exist`;
        throw error;
      }

      const newUser = this.usersRepository.create({
        account_active: accountactive,
        discord_id: discordId,
        role: userRole
      });
      savedUser = await this.usersRepository.save(newUser);

      const userRank = this.userRankService.createUserRank({
        discordId: discordId,
        rankOrderNumber: 1
      } as createUserRankWithOrderNumber)

      if (!userRank) {
        return;
      }

      savedUser = await this.usersRepository.save(newUser);

    } catch (err) {
      console.error(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return savedUser;
  }

  async getUser(discordId: string) {
    const userDatabaseObservable = this.getUserDatabaseData(discordId);
    const userDiscordObservable = this.getUserDiscordData(discordId);

    const userDatabaseData = userDatabaseObservable;
    const userDiscordData = await firstValueFrom(userDiscordObservable);

    const user: User = {
      ...userDatabaseData[0],
      discordTag:
        userDiscordData.user.username +
        '#' +
        userDiscordData.user.discriminator,
      discordDisplayName: userDiscordData.displayName,
    };

    return user;
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
  getAllUsersDatabaseData() {
    const userDatabaseData = from(this.usersRepository.find()).pipe(
      mergeMap((user) => user),
      map((user) => ({
        databaseData: user,
        discordData: this.getUserDiscordData(user.discord_id),
      })),
      mergeMap((resultA) => {
        return combineLatest([
          of(resultA.databaseData),
          from(resultA.discordData),
        ]);
      }),
      map(
        ([usersEntity, guildMember]): User => ({
          ...usersEntity,
          discordTag:
            guildMember.user.username + '#' + guildMember.user.discriminator,
          discordDisplayName: guildMember.displayName,
        }),
      ),
      toArray(),
    );

    return userDatabaseData;
  }

  getUserDatabaseData(discordId: string) {
    const userDatabaseData = this.usersRepository.find({
      where: {
        discord_id: discordId,
      },
    });

    return userDatabaseData;
  }

  getUserDiscordData(discordId: string) {
    const userDiscordData = from(
      this.client.guilds.fetch(process.env.DISCORD_GUILD_ID),
    ).pipe(
      switchMap((guild) => guild.members.fetch(discordId)),
      map((res) => res),
    );
    return userDiscordData;
  }
}
