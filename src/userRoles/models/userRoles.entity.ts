import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('userRoles')
export class UserRolesEntity {
  @PrimaryColumn({ type: 'bigint' })
  id: string;

  @Column()
  name: string;
}
