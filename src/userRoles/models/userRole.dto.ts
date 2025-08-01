export enum UserRole {
  MEMBER = 1,
  MODERATOR = 2,
  ADMINISTRATOR = 3,
}

export class createRoleDto {
  id?: number; // Optional for creation, will be set by the database
  name: string;
}
