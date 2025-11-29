import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Filter } from '@nestjs-query/core';
import { ConnectionType } from '@nestjs-query/query-graphql';

import { ServiceProvidersNotificationsDTO } from './service-providers-notifications.entity';
import {
  ServiceProvidersNotificationsConnection,
  ServiceProvidersNotificationsQuery,
  CustomCreateManyServiceProvidersNotificationsInput,
  CustomCreateOneServiceProvidersNotificationsInput,
  CustomDeleteOneServiceProvidersNotificationsInput,
  CustomFindOneServiceProvidersNotificationsArgs,
  CustomUpdateOneServiceProvidersNotificationsInput,
} from './service-providers-notifications.input';
import { ServiceProvidersNotificationsService } from './service-providers-notifications.service';

@UseGuards()
@Resolver(() => ServiceProvidersNotificationsDTO)
export class ServiceProvidersNotificationsResolver {
  constructor(
    private readonly serviceProvidersNotificationsService: ServiceProvidersNotificationsService,
  ) {}
}
