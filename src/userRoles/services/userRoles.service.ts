import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { UserRolesEntity } from 'src/userRoles/models/userRoles.entity';
import { Repository } from 'typeorm';
import { createRoleDto } from '../models/userRole.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRolesService {
  constructor(
    @InjectRepository(UserRolesEntity)
    private readonly userRolesRepository: Repository<UserRolesEntity>,
  ) {}

  async createRole(role: createRoleDto) {
    const newRole = this.userRolesRepository.create({ ...role });

    return await this.userRolesRepository.save(newRole);
  }
  getRole(roleId: number): Observable<UserRolesEntity> {
    return from(this.userRolesRepository.findOneBy({ id: roleId }));
  }

  async getAllRoles() {
    return await this.userRolesRepository.find();
  }
}
