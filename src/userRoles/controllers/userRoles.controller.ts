import { Controller, Get, Param } from '@nestjs/common';
import { Observable } from 'rxjs';
import {UserRolesService} from "../services/userRoles.service";
import {UserRolesEntity} from "../models/userRoles.entity";

@Controller('userRoles')
export class UserRolesController {
  constructor(private userRolesService: UserRolesService) {}

  @Get(':id')
  getRole(@Param('id') id: number): Observable<UserRolesEntity> {
    return this.userRolesService.getRole(id);
  }
}
