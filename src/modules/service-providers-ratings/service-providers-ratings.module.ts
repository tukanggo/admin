import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';

import {
  ServiceProvidersRatingsDTO,
  ServiceProvidersRatingsEntity,
} from './service-providers-ratings.entity';
import {
  CreateServiceProvidersRatingsInput,
  UpdateServiceProvidersRatingsInput,
} from './service-providers-ratings.input';
import { ServiceProvidersRatingsResolver } from './service-providers-ratings.resolver';
import { ServiceProvidersRatingsService } from './service-providers-ratings.service';
import { ServiceProvidersRatingsSubscriber } from './service-providers-ratings.subscriber';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([ServiceProvidersRatingsEntity])],
      services: [
        ServiceProvidersRatingsService,
        ServiceProvidersRatingsSubscriber,
        ServiceProvidersRatingsResolver,
      ],
      resolvers: [
        {
          ServiceClass: ServiceProvidersRatingsService,
          DTOClass: ServiceProvidersRatingsDTO,
          EntityClass: ServiceProvidersRatingsEntity,
          CreateDTOClass: CreateServiceProvidersRatingsInput,
          UpdateDTOClass: UpdateServiceProvidersRatingsInput,
          enableAggregate: true,
          guards: [],
        },
      ],
    }),
  ],
  controllers: [],
})
export class ServiceProvidersRatingsModule {}
