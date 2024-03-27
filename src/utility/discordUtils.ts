import { Client, GuildMember } from 'discord.js';
import {CorpsTypes, RankTypes} from "../ranks/models/ranks.entity";

export const getDiscordGuild = async (client: Client) => {
  return await client.guilds.fetch(process.env.DISCORD_GUILD_ID);
};

export const getUserDiscordRoles = (
  member: GuildMember,
  roleType = '',
): Array<String> => {
  const arr = [];

  if (roleType === 'rank' || roleType === '')
    for (const rankName in RankTypes)
      if (member.roles.cache.some((role) => role.name === RankTypes[rankName]))
        arr.push(RankTypes[rankName]);

  if (roleType === 'corps' || roleType === '')
    for (const corpsName in CorpsTypes)
      if (
        member.roles.cache.some(
          (role) => role.name === 'Korpus ' + CorpsTypes[corpsName],
        )
      )
        arr.push('Korpus ' + CorpsTypes[corpsName]);

  return arr;
};
