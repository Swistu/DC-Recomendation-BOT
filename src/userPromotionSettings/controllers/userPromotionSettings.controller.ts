import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, UsePipes } from '@nestjs/common';
import { UserPromotionSettingsService } from '../services/userPromotionSettings.service';
import { CreatePromotionSettingsDto, UpdatePromotionSettingsDto } from '../models/userPromotionSettings.dto';

@Controller('users/:id/promotionsettings')
export class UserPromotionSettingsController {
  constructor(private userPromotionSettingsService: UserPromotionSettingsService) { }

  @Get()
  getUserPromotionSettings(@Param('id') discordId: string) {
    return this.userPromotionSettingsService.getUserPromotionSettings(discordId);
  }

  @Post()
  createUserPromotionSettings(@Param('id') discordId: string, @Body() createPromotionSettingsDto: CreatePromotionSettingsDto) {
    return this.userPromotionSettingsService.createUserPromotionSettings({ discordId, ...createPromotionSettingsDto });
  }

  @Patch()
  updateUserPromotionSettings(@Param('id') discordId: string, @Body() updatePromotionSettingsDto: UpdatePromotionSettingsDto) {
    return this.userPromotionSettingsService.updateUserPromotionSettings(discordId, updatePromotionSettingsDto);
  }
}
