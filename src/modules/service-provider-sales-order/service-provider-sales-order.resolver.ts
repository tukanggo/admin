import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Filter } from '@nestjs-query/core';
import { ConnectionType } from '@nestjs-query/query-graphql';

import {
  ServiceProviderSalesOrderDTO,
  ServiceProviderSalesOrderEntity,
} from './service-provider-sales-order.entity';
import { CreateSPSalesOrderInput } from './service-provider-sales-order.input';
import { ServiceProviderSalesOrderService } from './service-provider-sales-order.service';
import { generatePaymentLink } from '@providers/senangpay.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceProvidersEntity } from '@entities';
import { Repository } from 'typeorm';
import { authData, GqlAuthUser } from '@modules/auth';
import { AuthData } from '@types';
import _ from 'lodash';
import { GqlAuthGuard } from '@guards/auth.guard';
import { nanoid } from 'nanoid';

@UseGuards(GqlAuthGuard)
@Resolver(() => ServiceProviderSalesOrderDTO)
export class ServiceProviderSalesOrderResolver {
  constructor(
    private readonly serviceProviderSalesOrderService: ServiceProviderSalesOrderService,
    @InjectRepository(ServiceProvidersEntity)
    private spRepo: Repository<ServiceProvidersEntity>,
    @InjectRepository(ServiceProviderSalesOrderEntity)
    private SalesOrderRepo: Repository<ServiceProviderSalesOrderEntity>,
  ) {}

  @Mutation(() => ServiceProviderSalesOrderDTO)
  async createSPSalesOrder(
    @GqlAuthUser() authData: AuthData,
    @Args('input') input: CreateSPSalesOrderInput,
  ): Promise<ServiceProviderSalesOrderDTO> {
    const { topUpAmount } = input;
    const tukang = await this.spRepo.findOne({ where: { id: authData.id } });

    if (!tukang) {
      throw new NotFoundException(`User not found`);
    }

    const refNo = `SP-${nanoid(18)}`;
    const salesOrder = await this.SalesOrderRepo.save({
      serviceProviderId: tukang.id,
      refNo,
      grandTotal: topUpAmount,
    });

    const paymentUrl = generatePaymentLink({
      transactionId: refNo,
      amount: _.toNumber(topUpAmount),
      name: tukang.fullName,
      email: tukang.email,
      phoneNo: tukang.phoneCountryCode + tukang.phoneNo,
      detail: 'Tukang_Top_up',
    });
    salesOrder.paymentUrl = paymentUrl;
    this.SalesOrderRepo.save(salesOrder);

    return salesOrder;
  }
}
