import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import {UsersEntity} from "../../users/models/users.entity";

@Entity('userRoles')
export class UserRolesEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column()
  name: string;

  @OneToMany(() => UsersEntity, (user) => user.role, { onDelete: 'NO ACTION' })
  user: UsersEntity[];
}
