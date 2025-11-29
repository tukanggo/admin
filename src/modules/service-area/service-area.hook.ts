import {
  BeforeCreateManyHook,
  BeforeCreateOneHook,
  CreateManyInputType,
  CreateOneInputType,
} from '@nestjs-query/query-graphql';
import { Injectable } from '@nestjs/common';
import { AppContext, GqlContext } from '@types';

interface CreateBy {
  createdBy: number;
  serviceProviderId: number;
}

@Injectable()
export class serviceAreaCreateOneHook<T extends CreateBy>
  implements BeforeCreateOneHook<T, GqlContext>
{
  run(
    instance: CreateOneInputType<T>,
    context: GqlContext,
  ): CreateOneInputType<T> | Promise<CreateOneInputType<T>> {
    const createdBy = context.req.user.id;
    instance.input.createdBy = createdBy;

    if (context.req.user.type === 'SERVICE_PROVIDER') {
      instance.input.serviceProviderId = context.req.user.id;
    }
    return instance;
  }
}

@Injectable()
export class serviceAreaCreateManyHook<T extends CreateBy>
  implements BeforeCreateManyHook<T, GqlContext>
{
  run(
    instance: CreateManyInputType<T>,
    context: GqlContext,
  ): CreateManyInputType<T> | Promise<CreateManyInputType<T>> {
    const serviceProviderId = context.req.user.id;
    const createdBy = context?.req?.user?.id;
    instance.input = instance.input.map((input) => ({ serviceProviderId, ...input, createdBy }));

    return instance;
  }
}
