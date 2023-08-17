import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRankEntity } from './models/userRoles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserRankEntity])],
})
export class UserRankModule {}
