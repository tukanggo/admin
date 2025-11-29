import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Filter } from '@nestjs-query/core';
import { ConnectionType } from '@nestjs-query/query-graphql';

import { SalesOrderServiceProofDTO } from './sales-order-service-proof.entity';
import {
  SalesOrderServiceProofConnection,
  SalesOrderServiceProofQuery,
  CustomCreateManySalesOrderServiceProofInput,
  CustomCreateOneSalesOrderServiceProofInput,
  CustomDeleteOneSalesOrderServiceProofInput,
  CustomFindOneSalesOrderServiceProofArgs,
  CustomUpdateOneSalesOrderServiceProofInput,
} from './sales-order-service-proof.input';
import { SalesOrderServiceProofService } from './sales-order-service-proof.service';

@UseGuards()
@Resolver(() => SalesOrderServiceProofDTO)
export class SalesOrderServiceProofResolver {
  constructor(private readonly salesOrderServiceProofService: SalesOrderServiceProofService) {}
}
