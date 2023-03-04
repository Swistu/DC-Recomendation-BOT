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
import { User } from '../models/user.dto';
import { InjectDiscordClient } from '@discord-nestjs/core';
import { Client, GuildMember } from 'discord.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,

    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  createUser(user: User): Observable<User> {
    return from(this.usersRepository.save(user));
  }

  async getUser(discordId: string): Promise<User> {
    const userDatabaseObservable = this.getUserDatabaseData(discordId);
    const userDiscordObservable = this.getUserDiscordData(discordId);

    const userDatabaseData = await firstValueFrom(userDatabaseObservable);
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

  getAllUsers(): Observable<User[]> {
    return this.getAllUsersDatabaseData();
  }

  updateUser(discordId: string, user: User): Observable<UpdateResult> {
    return from(this.usersRepository.update(discordId, user));
  }

  deleteUser(discordId: string): Observable<DeleteResult> {
    return from(this.usersRepository.delete(discordId));
  }

  // Helper functions
  getAllUsersDatabaseData(): Observable<User[]> {
    const userDatabaseData = from(this.usersRepository.find()).pipe(
      mergeMap((user) => user),
      map((user) => ({
        databaseData: user,
        discordData: this.getUserDiscordData(user.discordId),
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

  getUserDatabaseData(discordId: string): Observable<UsersEntity[]> {
    const userDatabaseData = from(
      this.usersRepository.find({
        where: {
          discordId: discordId,
        },
      }),
    );

    return userDatabaseData;
  }

  getUserDiscordData(discordId: string): Observable<GuildMember> {
    const userDiscordData = from(
      this.client.guilds.fetch(process.env.DICORD_GUILD_ID),
    ).pipe(
      switchMap((guild) => guild.members.fetch(discordId)),
      map((res) => res),
    );
    return userDiscordData;
  }
}
