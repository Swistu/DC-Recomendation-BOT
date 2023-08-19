import { UserRankEntity } from "src/userRank/models/userRank.entity";
import { UserRole } from "src/userRoles/models/userRole.dto";
import { UserRolesEntity } from "src/userRoles/models/userRoles.entity";
import { DeepPartial } from "typeorm";

export class User {
  discordId?: string;
  discordTag?: string;
  discordDisplayName?: string;
  accountActive?: boolean;
  role?: UserRolesEntity;
  createdDate?: Date;
}
export class UserAllData extends User {
  userRank: UserRankEntity
}
export class CreateUser {
  discordId: string;
  accountactive?: boolean | true;
  roleId: UserRole;
}