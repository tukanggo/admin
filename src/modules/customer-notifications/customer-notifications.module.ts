import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';

import {
  CustomerNotificationsDTO,
  CustomerNotificationsEntity,
} from './customer-notifications.entity';
import {
  CreateCustomerNotificationsInput,
  UpdateCustomerNotificationsInput,
} from './customer-notifications.input';
import { CustomerNotificationsResolver } from './customer-notifications.resolver';
import { CustomerNotificationsService } from './customer-notifications.service';
import { CustomerNotificationsSubscriber } from './customer-notifications.subscriber';
import { CustomersEntity } from '@entities';
import { GqlAuthGuard, GqlRolesGuard } from '@guards/auth.guard';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([CustomerNotificationsEntity, CustomersEntity]),
      ],
      services: [
        CustomerNotificationsService,
        CustomerNotificationsSubscriber,
        CustomerNotificationsResolver,
      ],
      resolvers: [
        {
          ServiceClass: CustomerNotificationsService,
          DTOClass: CustomerNotificationsDTO,
          EntityClass: CustomerNotificationsEntity,
          CreateDTOClass: CreateCustomerNotificationsInput,
          UpdateDTOClass: UpdateCustomerNotificationsInput,
          guards: [GqlAuthGuard, GqlRolesGuard],
        },
      ],
    }),
  ],
  controllers: [],
})
export class CustomerNotificationsModule {}
