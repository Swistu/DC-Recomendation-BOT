import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPromotionService } from './services/userPromotion.service';
import { UserPromotionController } from './controllers/userPromotion.controller';
import { UserPromotionEntity } from './models/userPromotion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserPromotionEntity]),
  ],
  controllers: [UserPromotionController],
  providers: [UserPromotionService],
  exports: [UserPromotionService]
})
export class UserPromotionModule { }
