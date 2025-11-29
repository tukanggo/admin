import { BeforeCreateOneHook, CreateOneInputType } from '@nestjs-query/query-graphql';
import { Injectable } from '@nestjs/common';
import { GqlContext } from '@types';

interface CreateBy {
  createdBy: number;
  customerId: number;
}

@Injectable()
export class salesOrderCreateOneHook<T extends CreateBy>
  implements BeforeCreateOneHook<T, GqlContext>
{
  run(
    instance: CreateOneInputType<T>,
    context: GqlContext,
  ): CreateOneInputType<T> | Promise<CreateOneInputType<T>> {
    const createdBy = context.req.user.id;
    instance.input.createdBy = createdBy;

    if (context.req.user.type === 'Customer') {
      instance.input.customerId = context.req.user.id;
    }
    return instance;
  }
}
