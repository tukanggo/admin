import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';

import { ServiceProvidersDTO, ServiceProvidersEntity } from './service-providers.entity';
import {
  CreateServiceProvidersInput,
  UpdateServiceProvidersInput,
} from './service-providers.input';
import { ServiceProvidersResolver } from './service-providers.resolver';
import { ServiceProvidersService } from './service-providers.service';
import { ServiceProvidersSubscriber } from './service-providers.subscriber';
import {
  CustomerNotificationsEntity,
  OrderItemsEntity,
  ProductOptionEntity,
  ProductOptionsCategoriesEntity,
  ProductsEntity,
  SalesOrderMatchesEntity,
  SalesOrdersEntity,
  ServiceProvidersNotificationsEntity,
  ServiceProvidersRatingsEntity,
  ServiceProvidersTransactionEntity,
} from '@entities';
import { SalesOrdersService } from '@modules/sales-orders';
import { ServiceProvidersController } from './service-provider.controller';
import { GqlAuthGuard } from '@guards/auth.guard';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([
          ServiceProvidersEntity,
          SalesOrdersEntity,
          ServiceProvidersRatingsEntity,
          ServiceProvidersTransactionEntity,
          SalesOrderMatchesEntity,
          ProductsEntity,
          ProductOptionEntity,
          ProductOptionsCategoriesEntity,
          CustomerNotificationsEntity,
          ServiceProvidersNotificationsEntity,
          OrderItemsEntity,
        ]),
      ],
      services: [ServiceProvidersService, ServiceProvidersSubscriber, ServiceProvidersResolver],
      resolvers: [
        {
          ServiceClass: ServiceProvidersService,
          DTOClass: ServiceProvidersDTO,
          EntityClass: ServiceProvidersEntity,
          CreateDTOClass: CreateServiceProvidersInput,
          UpdateDTOClass: UpdateServiceProvidersInput,
          guards: [GqlAuthGuard],
        },
      ],
    }),
  ],
  controllers: [ServiceProvidersController],
})
export class ServiceProvidersModule {}
