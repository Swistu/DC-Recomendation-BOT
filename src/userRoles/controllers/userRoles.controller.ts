import { Controller, Get, Param } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRolesEntity } from '../models/userRoles.entity';
import { UserRolesService } from '../services/userRoles.service';

@Controller('userRoles')
export class UserRolesController {
  constructor(private userRolesService: UserRolesService) {}

  @Get(':id')
  getRole(@Param('id') id: number): Observable<UserRolesEntity> {
    return this.userRolesService.getRole(id);
  }
}
