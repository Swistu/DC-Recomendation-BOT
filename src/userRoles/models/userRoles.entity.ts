import { Column, Entity, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from './userRole.dto';
import { UsersEntity } from 'src/users/models/users.entity';

@Entity('userRoles')
export class UserRolesEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column()
  name: string;

  @OneToMany(() => UsersEntity, (user) => user.role, { onDelete: 'NO ACTION' })
  user: UsersEntity[];
}
