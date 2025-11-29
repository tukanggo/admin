import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Filter } from '@nestjs-query/core';
import { ConnectionType } from '@nestjs-query/query-graphql';

import { AreaOfServiceDTO } from './area-of-service.entity';
import {
  AreaOfServiceConnection,
  AreaOfServiceQuery,
  CustomCreateManyAreaOfServiceInput,
  CustomCreateOneAreaOfServiceInput,
  CustomDeleteOneAreaOfServiceInput,
  CustomFindOneAreaOfServiceArgs,
  CustomUpdateOneAreaOfServiceInput,
} from './area-of-service.input';
import { AreaOfServiceService } from './area-of-service.service';

@UseGuards()
@Resolver(() => AreaOfServiceDTO)
export class AreaOfServiceResolver {
  constructor(private readonly areaOfServiceService: AreaOfServiceService) {}

  @Query(() => AreaOfServiceConnection)
  async customQuery(@Args() query: AreaOfServiceQuery): Promise<ConnectionType<AreaOfServiceDTO>> {
    const filter: Filter<AreaOfServiceDTO> = {
      ...query.filter,
    };
    return AreaOfServiceConnection.createFromPromise((q) => this.areaOfServiceService.query(q), {
      ...query,
      ...{ filter },
    });
  }

  @Query(() => AreaOfServiceDTO)
  async customFindOneAreaOfService(@Args() input: CustomFindOneAreaOfServiceArgs) {
    return null;
  }

  @Mutation(() => AreaOfServiceDTO)
  async customCreateOneAreaOfService(
    @Args('input') input: CustomCreateOneAreaOfServiceInput,
  ): Promise<AreaOfServiceDTO> {
    return null;
  }

  @Mutation(() => [AreaOfServiceDTO])
  async customCreateManyAreaOfService(
    @Args('input') input: CustomCreateManyAreaOfServiceInput,
  ): Promise<AreaOfServiceDTO> {
    return null;
  }

  @Mutation(() => AreaOfServiceDTO)
  async customUpdateOneAreaOfService(
    @Args('input') input: CustomUpdateOneAreaOfServiceInput,
  ): Promise<AreaOfServiceDTO> {
    return null;
  }

  @Mutation(() => AreaOfServiceDTO)
  async customDeleteOneAreaOfService(
    @Args('input') input: CustomDeleteOneAreaOfServiceInput,
  ): Promise<AreaOfServiceDTO> {
    return null;
  }
}
