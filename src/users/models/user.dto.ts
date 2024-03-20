import {UserRankEntity} from "../../userRank/models/userRank.entity";
import {UserRole} from "../../userRoles/models/userRole.dto";
import {UserRolesEntity} from "../../userRoles/models/userRoles.entity";

export class User {
  discordId?: string;
  discordTag?: string;
  discordDisplayName?: string;
  accountActive?: boolean;
  role?: UserRolesEntity;
  createdDate?: Date;
}
export class UserAllData extends User {
  userRank: UserRankEntity;
}
export class CreateUser {
  discordId: string;
  accountactive?: boolean | true;
  roleId: UserRole;
}
