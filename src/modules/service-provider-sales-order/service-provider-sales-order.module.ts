import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';

import {
  ServiceProviderSalesOrderDTO,
  ServiceProviderSalesOrderEntity,
} from './service-provider-sales-order.entity';
import {
  CreateServiceProviderSalesOrderInput,
  UpdateServiceProviderSalesOrderInput,
} from './service-provider-sales-order.input';
import { ServiceProviderSalesOrderResolver } from './service-provider-sales-order.resolver';
import { ServiceProviderSalesOrderService } from './service-provider-sales-order.service';
import { ServiceProviderSalesOrderSubscriber } from './service-provider-sales-order.subscriber';
import { ServiceProvidersEntity } from '@entities';
import { GqlAuthGuard, GqlRolesGuard } from '@guards/auth.guard';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([
          ServiceProviderSalesOrderEntity,
          ServiceProvidersEntity,
        ]),
      ],
      services: [
        ServiceProviderSalesOrderService,
        ServiceProviderSalesOrderSubscriber,
        ServiceProviderSalesOrderResolver,
      ],
      resolvers: [
        {
          ServiceClass: ServiceProviderSalesOrderService,
          DTOClass: ServiceProviderSalesOrderDTO,
          EntityClass: ServiceProviderSalesOrderEntity,
          CreateDTOClass: CreateServiceProviderSalesOrderInput,
          UpdateDTOClass: UpdateServiceProviderSalesOrderInput,
          guards: [GqlAuthGuard, GqlRolesGuard],
        },
      ],
    }),
  ],
  controllers: [],
})
export class ServiceProviderSalesOrderModule {}
