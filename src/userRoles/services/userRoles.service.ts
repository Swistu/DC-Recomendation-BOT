import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { UserRolesEntity } from '../../userRoles/models/userRoles.entity';
import { Repository } from 'typeorm';

export class UserRolesService {
  constructor(
    @InjectRepository(UserRolesEntity)
    private readonly userRolesRepository: Repository<UserRolesEntity>,
  ) {}

  getRole(roleId: number): Observable<UserRolesEntity> {
    return from(this.userRolesRepository.findOneBy({ id: roleId }));
  }
}
