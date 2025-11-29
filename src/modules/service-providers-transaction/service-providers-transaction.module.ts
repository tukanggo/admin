import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';

import {
  ServiceProvidersTransactionDTO,
  ServiceProvidersTransactionEntity,
} from './service-providers-transaction.entity';
import {
  CreateServiceProvidersTransactionInput,
  UpdateServiceProvidersTransactionInput,
} from './service-providers-transaction.input';
import { ServiceProvidersTransactionResolver } from './service-providers-transaction.resolver';
import { ServiceProvidersTransactionService } from './service-providers-transaction.service';
import { ServiceProvidersTransactionSubscriber } from './service-providers-transaction.subscriber';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([ServiceProvidersTransactionEntity])],
      services: [
        ServiceProvidersTransactionService,
        ServiceProvidersTransactionSubscriber,
        ServiceProvidersTransactionResolver,
      ],
      resolvers: [
        {
          ServiceClass: ServiceProvidersTransactionService,
          DTOClass: ServiceProvidersTransactionDTO,
          EntityClass: ServiceProvidersTransactionEntity,
          CreateDTOClass: CreateServiceProvidersTransactionInput,
          UpdateDTOClass: UpdateServiceProvidersTransactionInput,
          guards: [],
        },
      ],
    }),
  ],
  controllers: [],
})
export class ServiceProvidersTransactionModule {}
