import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { UserRole } from 'src/userRoles/models/userRole.dto';
import { UserRolesEntity } from 'src/userRoles/models/userRoles.entity';

@Entity('users')
export class UsersEntity {
  @PrimaryColumn({ type: 'bigint' })
  discord_id: string;

  @Column({ type: 'boolean', default: false })
  account_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => UserRolesEntity, (userRolesEntity) => userRolesEntity.user, { nullable: false })
  @JoinColumn({
		name: 'role_id',
	})
  role: UserRolesEntity;
}
