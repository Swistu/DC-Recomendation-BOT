import { Command } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { PromotionsShowSubCommand } from './sub-command/promotions-show/promotions-show.command';

@Command({
  name: 'awanse',
  description: 'zarządzanie awansami',
  include: [PromotionsShowSubCommand],
})

@Injectable()
export class PromotionsCommand { }
