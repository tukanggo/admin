import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Filter } from '@nestjs-query/core';
import { ConnectionType } from '@nestjs-query/query-graphql';

import { CustomerNotificationsDTO } from './customer-notifications.entity';
import {
  CustomerNotificationsConnection,
  CustomerNotificationsQuery,
  CustomCreateManyCustomerNotificationsInput,
  CustomCreateOneCustomerNotificationsInput,
  CustomDeleteOneCustomerNotificationsInput,
  CustomFindOneCustomerNotificationsArgs,
  CustomUpdateOneCustomerNotificationsInput,
} from './customer-notifications.input';
import { CustomerNotificationsService } from './customer-notifications.service';

@UseGuards()
@Resolver(() => CustomerNotificationsDTO)
export class CustomerNotificationsResolver {
  constructor(private readonly customerNotificationsService: CustomerNotificationsService) {}
}
