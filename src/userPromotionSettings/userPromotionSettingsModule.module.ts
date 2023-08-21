import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPromotionSettingsService } from './services/userPromotionSettings.service';
import { UserPromotionSettingsController } from './controllers/userPromotionSettings.controller';
import { UserPromotionSettingsEntity } from './models/userPromotionSettings.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserPromotionSettingsEntity]),
  ],
  controllers: [UserPromotionSettingsController],
  providers: [UserPromotionSettingsService],
  exports: []
})
export class UserPromotionSettingsModule { }
