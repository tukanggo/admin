import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';

import { CustomerAddressesDTO, CustomerAddressesEntity } from './customer-addresses.entity';
import {
  CreateCustomerAddressesInput,
  UpdateCustomerAddressesInput,
} from './customer-addresses.input';
import { CustomerAddressesResolver } from './customer-addresses.resolver';
import { CustomerAddressesService } from './customer-addresses.service';
import { CustomerAddressesSubscriber } from './customer-addresses.subscriber';
import { GqlAuthGuard } from '@guards/auth.guard';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([CustomerAddressesEntity])],
      services: [CustomerAddressesService, CustomerAddressesSubscriber, CustomerAddressesResolver],
      resolvers: [
        {
          ServiceClass: CustomerAddressesService,
          DTOClass: CustomerAddressesDTO,
          EntityClass: CustomerAddressesEntity,
          CreateDTOClass: CreateCustomerAddressesInput,
          UpdateDTOClass: UpdateCustomerAddressesInput,
          guards: [GqlAuthGuard],
        },
      ],
    }),
  ],
  controllers: [],
})
export class CustomerAddressesModule {}
