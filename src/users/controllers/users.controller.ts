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
import { User } from '../models/user.dto';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() user: User): Observable<User> {
    return this.usersService.createUser(user);
  }

  @Get()
  getAll(): Observable<User[]> {
    return this.usersService.getAllUsers();
  }
  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }

  @Put(':id')
  update(
    @Param('id')
    discordId: string,
    @Body()
    user: User,
  ): Observable<UpdateResult> {
    return this.usersService.updateUser(discordId, user);
  }

  @Delete(':id')
  remove(@Param('id') discordId: string) {
    return this.usersService.deleteUser(discordId);
  }
}
