import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import {UserRolesEntity} from "../models/userRoles.entity";

export class UserRolesService {
  constructor(
    @InjectRepository(UserRolesEntity)
    private readonly userRolesRepository: Repository<UserRolesEntity>,
  ) {}

  getRole(roleId: number): Observable<UserRolesEntity> {
    return from(this.userRolesRepository.findOneBy({ id: roleId }));
  }
}
