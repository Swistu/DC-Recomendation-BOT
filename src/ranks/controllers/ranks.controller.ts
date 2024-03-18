import { Controller, Get, Param } from '@nestjs/common';
import { RanksService } from '../services/ranks.service';

@Controller('rank')
export class RanksController {
  constructor(private rankService: RanksService) {}

  @Get(':id')
  getRankByName(@Param('id') name: string) {
    return this.rankService.getRankByName(name);
  }

  @Get(':id')
  getRankByOrderNumber(@Param('id') number: number) {
    return this.rankService.getRankByOrderNumber(number);
  }
}
