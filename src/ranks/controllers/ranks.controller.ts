import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RanksService } from '../services/ranks.service';
import { CreateRankDto } from '../models/ranks.dto';

@Controller('ranks')
export class RanksController {
  constructor(private rankService: RanksService) {}

  @Post()
  create(@Body() rank: CreateRankDto) {
    return this.rankService.createRank(rank);
  }
  @Get()
  getAllRanks() {
    return this.rankService.getAllRanks();
  }
  @Get(':id')
  getRankByName(@Param('id') name: string) {
    return this.rankService.getRankByName(name);
  }

  @Get(':id')
  getRankByOrderNumber(@Param('id') number: number) {
    return this.rankService.getRankByOrderNumber(number);
  }
}
