import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SettingsDTO } from './settings.entity';
import { SettingsService } from './settings.service';

@UseGuards()
@Resolver(() => SettingsDTO)
export class SettingsResolver {
  constructor(private readonly settingsService: SettingsService) {}
}
