import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository, UpdateResult } from 'typeorm';
import { UserPromotionSettingsEntity } from '../models/userPromotionSettings.entity';
import { CreateUserPromotionSettingsDto, UpdatePromotionSettingsDto, UpdateUserPromotionSettingsDto } from '../models/userPromotionSettings.dto';


export class UserPromotionSettingsService {
  constructor(
    @InjectRepository(UserPromotionSettingsEntity)
    private readonly userPromotionSettingsRepository: Repository<UserPromotionSettingsEntity>,
  ) { }

  async getUserPromotionSettings(discordId: string) {
    return await this.userPromotionSettingsRepository.findOneBy({ discord_id: discordId });
  }

  async updateUserPromotionSettings(discordId: string, userPromotionSettingsDto: UpdatePromotionSettingsDto) {
    const update = await this.userPromotionSettingsRepository.upsert([{ discord_id: discordId, ...userPromotionSettingsDto }], ["discord_id"]);

    return update;
  }

  async createUserPromotionSettings(userPromotionSettingsDto: CreateUserPromotionSettingsDto) {
    const updateUserPromotionSettings = this.userPromotionSettingsRepository.create({
      ...userPromotionSettingsDto,
      discord_id: userPromotionSettingsDto.discordId
    })

    const savedUserPromotion = await this.userPromotionSettingsRepository.save(updateUserPromotionSettings);

    return savedUserPromotion;
  }

  async getUserPromotion(discordId: string) {
    const userPromotion = this.userPromotionSettingsRepository.findOneBy({ discord_id: discordId })
  }
}
