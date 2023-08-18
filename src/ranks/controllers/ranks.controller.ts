import { Controller, Get, Param } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RankService } from '../services/ranks.service';


@Controller('rank')
export class RankController {
  constructor(private rankService: RankService) {}

  @Get(':id')
  getRankByName(@Param('id') name: string) {
    return this.rankService.getRankByName(name);
  }

  @Get(':id')
  getRankByOrderNumber(@Param('id') number: number) {
    return this.rankService.getRankByOrderNumber(number);
  }
}
