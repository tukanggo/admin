import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Filter } from '@nestjs-query/core';
import { ConnectionType } from '@nestjs-query/query-graphql';

import { ServiceAreaDTO } from './service-area.entity';
import {
  ServiceAreaConnection,
  ServiceAreaQuery,
  CustomCreateManyServiceAreaInput,
  CustomCreateOneServiceAreaInput,
  CustomDeleteOneServiceAreaInput,
  CustomFindOneServiceAreaArgs,
  CustomUpdateOneServiceAreaInput,
} from './service-area.input';
import { ServiceAreaService } from './service-area.service';

@UseGuards()
@Resolver(() => ServiceAreaDTO)
export class ServiceAreaResolver {
  constructor(private readonly serviceAreaService: ServiceAreaService) {}
}
