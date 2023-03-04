import { Column, Entity, PrimaryColumn } from 'typeorm';
import { UserRole } from './user.dto';
@Entity('users')
export class UsersEntity {
  @PrimaryColumn({ type: 'bigint' })
  discordId: string;

  @Column({ type: 'boolean', default: false })
  accountActive: boolean;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.MEMBER })
  role: UserRole;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}