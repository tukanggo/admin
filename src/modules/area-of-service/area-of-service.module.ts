import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';

import { AreaOfServiceDTO, AreaOfServiceEntity } from './area-of-service.entity';
import { CreateAreaOfServiceInput, UpdateAreaOfServiceInput } from './area-of-service.input';
import { AreaOfServiceResolver } from './area-of-service.resolver';
import { AreaOfServiceService } from './area-of-service.service';
import { AreaOfServiceSubscriber } from './area-of-service.subscriber';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([AreaOfServiceEntity])],
      services: [AreaOfServiceService, AreaOfServiceSubscriber, AreaOfServiceResolver],
      resolvers: [
        {
          ServiceClass: AreaOfServiceService,
          DTOClass: AreaOfServiceDTO,
          EntityClass: AreaOfServiceEntity,
          CreateDTOClass: CreateAreaOfServiceInput,
          UpdateDTOClass: UpdateAreaOfServiceInput,
          guards: [],
        },
      ],
    }),
  ],
  controllers: [],
})
export class AreaOfServiceModule {}
