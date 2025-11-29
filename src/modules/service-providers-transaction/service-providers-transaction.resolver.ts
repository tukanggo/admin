import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Filter } from '@nestjs-query/core';
import { ConnectionType } from '@nestjs-query/query-graphql';

import { ServiceProvidersTransactionDTO } from './service-providers-transaction.entity';
import {
  ServiceProvidersTransactionConnection,
  ServiceProvidersTransactionQuery,
  CustomCreateManyServiceProvidersTransactionInput,
  CustomCreateOneServiceProvidersTransactionInput,
  CustomDeleteOneServiceProvidersTransactionInput,
  CustomFindOneServiceProvidersTransactionArgs,
  CustomUpdateOneServiceProvidersTransactionInput,
} from './service-providers-transaction.input';
import { ServiceProvidersTransactionService } from './service-providers-transaction.service';

@UseGuards()
@Resolver(() => ServiceProvidersTransactionDTO)
export class ServiceProvidersTransactionResolver {
  constructor(
    private readonly serviceProvidersTransactionService: ServiceProvidersTransactionService,
  ) {}
}
