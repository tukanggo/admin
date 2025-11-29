import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';

import {
  SalesOrderServiceProofDTO,
  SalesOrderServiceProofEntity,
} from './sales-order-service-proof.entity';
import {
  CreateSalesOrderServiceProofInput,
  UpdateSalesOrderServiceProofInput,
} from './sales-order-service-proof.input';
import { SalesOrderServiceProofResolver } from './sales-order-service-proof.resolver';
import { SalesOrderServiceProofService } from './sales-order-service-proof.service';
import { SalesOrderServiceProofSubscriber } from './sales-order-service-proof.subscriber';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([SalesOrderServiceProofEntity])],
      services: [
        SalesOrderServiceProofService,
        SalesOrderServiceProofSubscriber,
        SalesOrderServiceProofResolver,
      ],
      resolvers: [
        {
          ServiceClass: SalesOrderServiceProofService,
          DTOClass: SalesOrderServiceProofDTO,
          EntityClass: SalesOrderServiceProofEntity,
          CreateDTOClass: CreateSalesOrderServiceProofInput,
          UpdateDTOClass: UpdateSalesOrderServiceProofInput,
          guards: [],
        },
      ],
    }),
  ],
  controllers: [],
})
export class SalesOrderServiceProofModule {}
