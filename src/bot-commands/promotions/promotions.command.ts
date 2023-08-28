import { Command } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { PromotionsShowSubCommand } from './sub-command/promotions-show/promotions-show.command';
import { PromotionsGrantSubCommand } from './sub-command/promotions-grant/promotions-grant.command';

@Command({
  name: 'awanse',
  description: 'zarządzanie awansami',
  include: [PromotionsShowSubCommand, PromotionsGrantSubCommand],
})

@Injectable()
export class PromotionsCommand { }
