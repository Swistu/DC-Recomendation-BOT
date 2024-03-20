import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UserPromotionService } from '../services/userPromotion.service';
import {
  CreatePromotionDto,
  UpdatePromotionDto,
} from '../models/userPromotion.dto';

@Controller('users/')
export class UserPromotionController {
  constructor(private userPromotionService: UserPromotionService) {}

  @Get(':id/promotion')
  getUserPromotion(@Param('id') discordId: string) {
    return this.userPromotionService.getUserPromotion(discordId);
  }

  @Post(':id/promotion')
  createUserPromotion(
    @Param('id') discordId: string,
    @Body() createPromotionDto: CreatePromotionDto,
  ) {
    return this.userPromotionService.createUserPromotion({
      discordId,
      ...createPromotionDto,
    });
  }

  @Patch(':id/promotion')
  updateUserPromotion(
    @Param('id') discordId: string,
    @Body() updatePromotionDto: UpdatePromotionDto,
  ) {
    return this.userPromotionService.updateUserPromotion(
      discordId,
      updatePromotionDto,
    );
  }

  @Get(':id/promotion/status')
  checkUserPromotion(@Param('id') discordId: string) {
    return this.userPromotionService.checkUserPromotion(discordId);
  }

  @Get('promotion/status')
  async checkAllPromotions() {
    return this.userPromotionService.checkAllPromotions();
  }
}
