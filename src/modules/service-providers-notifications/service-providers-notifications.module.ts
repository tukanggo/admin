import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';

import {
  ServiceProvidersNotificationsDTO,
  ServiceProvidersNotificationsEntity,
} from './service-providers-notifications.entity';
import {
  CreateServiceProvidersNotificationsInput,
  UpdateServiceProvidersNotificationsInput,
} from './service-providers-notifications.input';
import { ServiceProvidersNotificationsResolver } from './service-providers-notifications.resolver';
import { ServiceProvidersNotificationsService } from './service-providers-notifications.service';
import { ServiceProvidersNotificationsSubscriber } from './service-providers-notifications.subscriber';
import { ServiceProvidersEntity } from '@entities';
import { GqlAuthGuard, GqlRolesGuard } from '@guards/auth.guard';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([
          ServiceProvidersNotificationsEntity,
          ServiceProvidersEntity,
        ]),
      ],
      services: [
        ServiceProvidersNotificationsService,
        ServiceProvidersNotificationsSubscriber,
        ServiceProvidersNotificationsResolver,
      ],
      resolvers: [
        {
          ServiceClass: ServiceProvidersNotificationsService,
          DTOClass: ServiceProvidersNotificationsDTO,
          EntityClass: ServiceProvidersNotificationsEntity,
          CreateDTOClass: CreateServiceProvidersNotificationsInput,
          UpdateDTOClass: UpdateServiceProvidersNotificationsInput,
          guards: [GqlAuthGuard, GqlRolesGuard],
        },
      ],
    }),
  ],
  controllers: [],
})
export class ServiceProvidersNotificationsModule {}
