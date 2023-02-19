import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UpdateResult } from 'typeorm';
import { Users } from '../models/users.dto';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() user: Users): Observable<Users> {
    return this.usersService.createUser(user);
  }

  @Get()
  getAll(): Observable<Users[]> {
    return this.usersService.getAllUsers();
  }

  @Put(':id')
  update(
    @Param('id')
    id: number,
    @Body()
    user: Users,
  ): Observable<UpdateResult> {
    return this.usersService.updateUser(id, user);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.deleteUser(id);
  }
}
