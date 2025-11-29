import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Filter } from '@nestjs-query/core';
import { ConnectionType } from '@nestjs-query/query-graphql';

import { BannersDTO } from './banners.entity';
import {
  BannersConnection,
  BannersQuery,
  CustomCreateManyBannersInput,
  CustomCreateOneBannersInput,
  CustomDeleteOneBannersInput,
  CustomFindOneBannersArgs,
  CustomUpdateOneBannersInput,
} from './banners.input';
import { BannersService } from './banners.service';

@UseGuards()
@Resolver(() => BannersDTO)
export class BannersResolver {
  constructor(private readonly bannersService: BannersService) {}
}
