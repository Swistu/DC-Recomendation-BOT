export enum UserRole {
  MEMBER = 1,
  MODERATOR = 2,
  ADMINISTRATOR = 3,
}

export class User {
  discordId?: string;
  discordTag?: string;
  discordDisplayName?: string;
  accountActive?: boolean;
  roleId?: UserRole;
  createdDate?: Date;
}
