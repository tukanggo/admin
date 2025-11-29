import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';

import { SearchHistoriesDTO, SearchHistoriesEntity } from './search-histories.entity';
import { CreateSearchHistoriesInput, UpdateSearchHistoriesInput } from './search-histories.input';
import { SearchHistoriesResolver } from './search-histories.resolver';
import { SearchHistoriesService } from './search-histories.service';
import { SearchHistoriesSubscriber } from './search-histories.subscriber';
import { GqlAuthGuard, GqlRolesGuard } from '@guards/auth.guard';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([SearchHistoriesEntity])],
      services: [SearchHistoriesService, SearchHistoriesSubscriber, SearchHistoriesResolver],
      resolvers: [
        {
          ServiceClass: SearchHistoriesService,
          DTOClass: SearchHistoriesDTO,
          EntityClass: SearchHistoriesEntity,
          CreateDTOClass: CreateSearchHistoriesInput,
          UpdateDTOClass: UpdateSearchHistoriesInput,
          guards: [GqlAuthGuard, GqlRolesGuard],
        },
      ],
    }),
  ],
  controllers: [],
})
export class SearchHistoriesModule {}
