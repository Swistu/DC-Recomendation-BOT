import { Command } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { RecommendationAddSubCommand } from './sub-command/recommendations-add/recommendations-add.command';

@Command({
  name: 'rekomendacje',
  description: 'zarządzanie rekomendacjami',
  include: [RecommendationAddSubCommand],
})

@Injectable()
export class RecommendationsCommand { }
