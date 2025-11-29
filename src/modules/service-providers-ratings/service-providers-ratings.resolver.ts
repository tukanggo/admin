import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Filter } from '@nestjs-query/core';
import { ConnectionType } from '@nestjs-query/query-graphql';

import { ServiceProvidersRatingsDTO } from './service-providers-ratings.entity';
import {
  ServiceProvidersRatingsConnection,
  ServiceProvidersRatingsQuery,
  CustomCreateManyServiceProvidersRatingsInput,
  CustomCreateOneServiceProvidersRatingsInput,
  CustomDeleteOneServiceProvidersRatingsInput,
  CustomFindOneServiceProvidersRatingsArgs,
  CustomUpdateOneServiceProvidersRatingsInput,
} from './service-providers-ratings.input';
import { ServiceProvidersRatingsService } from './service-providers-ratings.service';

@UseGuards()
@Resolver(() => ServiceProvidersRatingsDTO)
export class ServiceProvidersRatingsResolver {
  constructor(private readonly serviceProvidersRatingsService: ServiceProvidersRatingsService) {}
}
