import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  combineLatest,
  firstValueFrom,
  from,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
  toArray,
} from 'rxjs';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { UsersEntity } from '../models/users.entity';
import { CreateUser, User } from '../models/user.dto';
import { InjectDiscordClient } from '@discord-nestjs/core';
import { Client, GuildMember } from 'discord.js';
import { UserRolesEntity } from 'src/userRoles/models/userRoles.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,

    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    @InjectRepository(UserRolesEntity)
    private readonly userRolesEntity: Repository<UserRolesEntity>,
  ) { }

  async createUser(user: CreateUser) {

    const userRole = await this.userRolesEntity.findOneBy({
      id: user.roleId
    });
    const newUser = this.usersRepository.create({
      account_active: true,
      discord_id: user.discordId,
      role: userRole
    });

    const savedUser = await this.usersRepository.save(newUser);

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
    return from(this.usersRepository.update(discordId, user));
  }

  deleteUser(discordId: string) {
    return from(this.usersRepository.delete(discordId));
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
