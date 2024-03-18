import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRankEntity } from './models/userRank.entity';
import { UserRankController } from './controllers/userRank.controller';
import { UserRankService } from './services/userRank.service';
import { RanksEntity } from 'src/ranks/models/ranks.entity';
import { UsersEntity } from 'src/users/models/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRankEntity, RanksEntity, UsersEntity]),
  ],
  controllers: [UserRankController],
  providers: [UserRankService],
  exports: [UserRankService],
})
export class UserRankModule {}
