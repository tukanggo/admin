import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';

import { SalesOrdersDTO, SalesOrdersEntity } from './sales-orders.entity';
import { CreateSalesOrdersInput, UpdateSalesOrdersInput } from './sales-orders.input';
import { SalesOrdersResolver } from './sales-orders.resolver';
import { SalesOrdersService } from './sales-orders.service';
import { SalesOrdersSubscriber } from './sales-orders.subscriber';
import {
  CustomersEntity,
  ProductItemsEntity,
  ProductOptionsCategoriesEntity,
  ProductOptionEntity,
  ProductsEntity,
  ServiceProvidersEntity,
  ServiceProvidersNotificationsEntity,
  CustomerNotificationsEntity,
  CustomerAddressesEntity,
  OrderItemsEntity,
  SalesOrderMatchesItemsEntity,
  SalesOrderServiceProofEntity,
  ServiceProvidersTransactionEntity,
  SalesOrderMatchesEntity,
} from '@entities';
import { SalesOrdersController } from './sals-orders.controller';
import { GqlAuthGuard, GqlRolesGuard } from '@guards/auth.guard';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([
          SalesOrdersEntity,
          SalesOrderMatchesItemsEntity,
          SalesOrderServiceProofEntity,
          ServiceProvidersTransactionEntity,
          CustomersEntity,
          ServiceProvidersEntity,
          ServiceProvidersNotificationsEntity,
          CustomerNotificationsEntity,
          ProductsEntity,
          ProductItemsEntity,
          ProductOptionsCategoriesEntity,
          ProductOptionEntity,
          CustomerAddressesEntity,
          OrderItemsEntity,
          SalesOrderMatchesEntity,
        ]),
      ],
      services: [SalesOrdersService, SalesOrdersSubscriber, SalesOrdersResolver],
      resolvers: [
        {
          ServiceClass: SalesOrdersService,
          DTOClass: SalesOrdersDTO,
          EntityClass: SalesOrdersEntity,
          CreateDTOClass: CreateSalesOrdersInput,
          UpdateDTOClass: UpdateSalesOrdersInput,
          guards: [GqlAuthGuard, GqlRolesGuard],
        },
      ],
    }),
  ],
  controllers: [SalesOrdersController],
})
export class SalesOrdersModule {}
