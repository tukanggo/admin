import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';

import { AdminServiceAreaDTO, ServiceAreaDTO, ServiceAreaEntity } from './service-area.entity';
import {
  AdminCreateServiceAreaInput,
  AdminUpdateServiceAreaInput,
  CreateServiceAreaInput,
  UpdateServiceAreaInput,
} from './service-area.input';
import { ServiceAreaResolver } from './service-area.resolver';
import { ServiceAreaService } from './service-area.service';
import { ServiceAreaSubscriber } from './service-area.subscriber';
import { AdminAuthGuard, GqlAuthGuard } from '@guards/auth.guard';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([ServiceAreaEntity])],
      services: [ServiceAreaService, ServiceAreaSubscriber, ServiceAreaResolver],
      resolvers: [
        {
          ServiceClass: ServiceAreaService,
          DTOClass: ServiceAreaDTO,
          EntityClass: ServiceAreaEntity,
          CreateDTOClass: CreateServiceAreaInput,
          UpdateDTOClass: UpdateServiceAreaInput,
          guards: [GqlAuthGuard],
        },
        {
          ServiceClass: ServiceAreaService,
          DTOClass: AdminServiceAreaDTO,
          EntityClass: ServiceAreaEntity,
          CreateDTOClass: AdminCreateServiceAreaInput,
          UpdateDTOClass: AdminUpdateServiceAreaInput,
          guards: [AdminAuthGuard],
        },
      ],
    }),
  ],
  controllers: [],
})
export class ServiceAreaModule {}
