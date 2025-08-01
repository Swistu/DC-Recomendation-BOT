import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserRolesEntity } from '../models/userRoles.entity';
import { UserRolesService } from '../services/userRoles.service';
import { createRoleDto } from '../models/userRole.dto';

@Controller('userRoles')
export class UserRolesController {
  constructor(private userRolesService: UserRolesService) {}

  @Post()
  async createRole(@Body() roleData: createRoleDto) {
    return this.userRolesService.createRole(roleData);
  }
  @Get(':id')
  async getRole(@Param('id') id: number) {
    return this.userRolesService.getRole(id);
  }

  @Get()
  async getAllRoles() {
    return this.userRolesService.getAllRoles(); // Assuming 0 returns all roles, adjust as necessary
  }
}
