import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';

import { BannersDTO, BannersEntity } from './banners.entity';
import { CreateBannersInput, UpdateBannersInput } from './banners.input';
import { BannersResolver } from './banners.resolver';
import { BannersService } from './banners.service';
import { BannersSubscriber } from './banners.subscriber';
import { CustomerNotificationsEntity, CustomersEntity } from '@entities';
import { GqlAuthGuard } from '@guards/auth.guard';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([
          BannersEntity,
          CustomersEntity,
          CustomerNotificationsEntity,
        ]),
      ],
      services: [BannersService, BannersSubscriber, BannersResolver],
      resolvers: [
        {
          ServiceClass: BannersService,
          DTOClass: BannersDTO,
          EntityClass: BannersEntity,
          CreateDTOClass: CreateBannersInput,
          UpdateDTOClass: UpdateBannersInput,
          guards: [GqlAuthGuard],
        },
      ],
    }),
  ],
  controllers: [],
})
export class BannersModule {}
