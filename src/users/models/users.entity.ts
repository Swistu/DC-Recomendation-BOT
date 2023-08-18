import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { UserRolesEntity } from 'src/userRoles/models/userRoles.entity';
import { UserRankEntity } from 'src/userRank/models/userRank.entity';
 
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
