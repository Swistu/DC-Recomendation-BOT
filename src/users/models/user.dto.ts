export enum UserRole {
  MEMBER = 'member',
  MODERATOR = 'moderator',
  ADMINISTRATOR = 'administrator',
}

export class User {
  discordId?: string;
  discordTag?: string;
  discordDisplayName?: string;
  accountActive?: boolean;
  role?: UserRole;
  createdAt?: Date;
}
