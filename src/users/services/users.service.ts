import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { UsersEntity } from '../models/users.entity';
import { Users } from '../models/users.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  createUser(user: Users): Observable<Users> {
    return from(this.usersRepository.save(user));
  }

  getAllUsers(): Observable<Users[]> {
    return from(this.usersRepository.find());
  }

  updateUser(id: number, user: Users): Observable<UpdateResult> {
    return from(this.usersRepository.update(id, user));
  }

  deleteUser(id: number): Observable<DeleteResult> {
    return from(this.usersRepository.delete(id));
  }
}
