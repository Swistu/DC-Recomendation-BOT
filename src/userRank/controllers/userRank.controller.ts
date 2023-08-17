import { Controller, Get, Param } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRankService } from '../services/userRank.service';
import { UserRankEntity } from '../models/userRoles.entity';

@Controller('userRank')
export class UserRankController {
  constructor(private userRankService: UserRankService) {}

  @Get(':id')
  getRank(@Param('id') id: string): Observable<UserRankEntity> {
    return this.userRankService.getUserRankByDiscordId(id);
  }
}
