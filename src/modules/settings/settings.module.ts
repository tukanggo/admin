import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';

import { SettingsDTO, SettingsEntity } from './settings.entity';
import { CreateSettingsInput, UpdateSettingsInput } from './settings.input';
import { SettingsResolver } from './settings.resolver';
import { SettingsService } from './settings.service';
import { SettingsSubscriber } from './settings.subscriber';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([SettingsEntity])],
      services: [SettingsService, SettingsSubscriber, SettingsResolver],
      resolvers: [
        {
          ServiceClass: SettingsService,
          DTOClass: SettingsDTO,
          EntityClass: SettingsEntity,
          CreateDTOClass: CreateSettingsInput,
          UpdateDTOClass: UpdateSettingsInput,
          guards: [],
        },
      ],
    }),
  ],
  controllers: [],
})
export class SettingsModule {}
