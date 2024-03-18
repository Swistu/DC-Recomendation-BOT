import { Command } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { RecommendationAddSubCommand } from './sub-command/recommendations-add/recommendations-add.command';
import { RecommendationRemoveSubCommand } from './sub-command/recommendations-remove/recommendations-remove.command';

@Command({
  name: 'rekomendacje',
  description: 'zarządzanie rekomendacjami',
  include: [RecommendationAddSubCommand, RecommendationRemoveSubCommand],
})
@Injectable()
export class RecommendationsCommand {}
