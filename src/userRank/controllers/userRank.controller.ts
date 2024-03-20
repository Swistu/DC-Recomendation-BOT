import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { UserRankService } from '../services/userRank.service';
import {
  createUserRankWithId,
  createUserRankWithOrderNumber,
  createUserRankWithRankName,
} from '../models/userRank.dto';

@Controller('userRank')
export class UserRankController {
  constructor(private userRankService: UserRankService) {}

  @Get(':id')
  getRank(@Param('id') id: string) {
    return this.userRankService.getUserRankByDiscordId(id);
  }

  @Post()
  async createUserRank(
    @Body()
    userRank:
      | createUserRankWithId
      | createUserRankWithRankName
      | createUserRankWithOrderNumber,
  ) {
    const createUserRank = await this.userRankService.createUserRank(userRank);

    if (!createUserRank) {
      throw new HttpException('Cannot create user', HttpStatus.BAD_REQUEST);
    }

    return createUserRank;
  }
}
