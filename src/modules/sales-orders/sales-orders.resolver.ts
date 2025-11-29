/* eslint-disable @typescript-eslint/ban-ts-comment */
import { BadRequestException, NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Filter } from '@nestjs-query/core';
import { ConnectionType } from '@nestjs-query/query-graphql';

import {
  CheckDailyGrandTotalDTO,
  GetMyOrdersDto,
  SalesOrdersDTO,
  SalesOrdersEntity,
} from './sales-orders.entity';
import {
  CreateSalesOrdersInput,
  CustomBookQuotationInput,
  CustomCreateOneSalesOrdersInput,
  CustomSalesOrderInput,
  filterDateInput,
  SalesOrdersConnection,
  SalesOrdersQuery,
  updateSalesOrderStatusInput,
} from './sales-orders.input';
import { SalesOrdersService } from './sales-orders.service';
import { GqlAuthUser } from '@modules/auth';
import { AuthData } from '@types';
import { GqlAuthGuard } from '@guards/auth.guard';
import { In, IsNull, Not, Repository } from 'typeorm';
import {
  CustomerAddressesEntity,
  CustomersEntity,
  OrderItemsEntity,
  ProductOptionEntity,
  ProductOptionsCategoriesEntity,
  ProductsEntity,
  SalesOrderMatchesEntity,
  SalesOrderMatchesItemsEntity,
  SalesOrderServiceProofEntity,
  ServiceProvidersNotificationsEntity,
  ServiceProvidersTransactionEntity,
} from '@entities';
import { InjectRepository } from '@nestjs/typeorm';
import { SalesOrderStatusTypes } from './sales-orders.enum';
import _, { isNull, take } from 'lodash';
import { FileUpload } from 'graphql-upload';
import { uploadReadableStreamToS3 } from '@providers/s3.service';
import { serviceProviderTransactionEnum } from '@modules/service-providers-transaction/service-provider-transaction.enum';
import moment from 'moment';

@UseGuards(GqlAuthGuard)
@Resolver(() => SalesOrdersDTO)
export class SalesOrdersResolver {
  constructor(
    private readonly salesOrdersService: SalesOrdersService,
    @InjectRepository(SalesOrderServiceProofEntity)
    private salesOrderServiceProofRepo: Repository<SalesOrderServiceProofEntity>,
    @InjectRepository(SalesOrdersEntity)
    private salesOrderRepo: Repository<SalesOrdersEntity>,
    @InjectRepository(OrderItemsEntity)
    private orderItemRepo: Repository<OrderItemsEntity>,
    @InjectRepository(ServiceProvidersTransactionEntity)
    private spTransactionRepo: Repository<ServiceProvidersTransactionEntity>,
    @InjectRepository(ProductOptionsCategoriesEntity)
    private productOptionCategoriesRepo: Repository<ProductOptionsCategoriesEntity>,
    @InjectRepository(ProductOptionEntity)
    private productOptionRepo: Repository<ProductOptionEntity>,
    @InjectRepository(ProductsEntity)
    private productRepo: Repository<ProductsEntity>,
    @InjectRepository(CustomersEntity)
    private customerRepo: Repository<CustomersEntity>,
    @InjectRepository(CustomerAddressesEntity)
    private customerAddressRepo: Repository<CustomerAddressesEntity>,
    @InjectRepository(SalesOrderMatchesItemsEntity)
    private salesOrderMatchItemRepo: Repository<SalesOrderMatchesItemsEntity>,
    @InjectRepository(SalesOrderMatchesEntity)
    private salesOrderMatchRepo: Repository<SalesOrderMatchesEntity>,
    @InjectRepository(ServiceProvidersNotificationsEntity)
    private spNotificationRepo: Repository<ServiceProvidersNotificationsEntity>,
  ) {}

  @Query(() => SalesOrdersConnection, { nullable: true })
  async getMyJobInfo(
    @GqlAuthUser() user: AuthData,
    @Args() query: SalesOrdersQuery,
  ): Promise<ConnectionType<SalesOrdersDTO>> {
    const filter: Filter<SalesOrdersDTO> = {
      ...query.filter,
      ...{
        serviceProviderId: { eq: user.id },
      },
    };

    return SalesOrdersConnection.createFromPromise(
      (q) => this.salesOrdersService.query(q),
      {
        ...query,
        ...{ filter },
      },
      async (filter) => this.salesOrdersService.count(filter),
    );
  }

  @Query(() => SalesOrdersDTO)
  async getSalesOrderById(@Args('id') id: number) {
    return this.salesOrderRepo.findOne({
      where: { id },
      withDeleted: true,
      relations: {
        orderItems: true,
        customer: true,
        serviceProvider: true,
      },
    });
  }

  @Query(() => GetMyOrdersDto)
  async customSalesOrders(
    @GqlAuthUser() user: AuthData,
    @Args('input') input: CustomSalesOrderInput,
  ) {
    const { filterSalesOrderStatus, limit = 10, offset = 0 } = input;
    const skip = offset === 0 ? 0 : offset === 1 ? limit : limit * offset - limit;
    const status =
      filterSalesOrderStatus === 'MATCHING'
        ? `salesOrderStatus = 'MATCHING'`
        : filterSalesOrderStatus === 'ACTIVE'
        ? `salesOrderStatus NOT IN ( 'COMPLETE', 'MATCHING', 'CANCELLED', 'SP_COMPLETE')`
        : `salesOrderStatus = 'COMPLETE'`;
    // const [salesOrders, count] = await this.salesOrderRepo
    //   .createQueryBuilder('salesOrders')
    //   .withDeleted()
    //   .where(`salesOrders.customerId = ${user.id}`)
    //   .andWhere(status)
    //   .leftJoinAndSelect('salesOrders.product', 'product', 'products.id = salesOrders.productId')
    //   .leftJoinAndSelect(
    //     'product.productCategory',
    //     'productCategory',
    //     'productCategory.productId = products.id',
    //   )
    //   .limit(limit)
    //   .skip(skip)
    //   .getManyAndCount();
    const [salesOrders, count] = await this.salesOrderRepo.findAndCount({
      where: {
        customerId: user.id,
        deletedAt: IsNull(),
        salesOrderStatus:
          filterSalesOrderStatus === 'MATCHING'
            ? SalesOrderStatusTypes.MATCHING
            : filterSalesOrderStatus === 'ACTIVE'
            ? Not(
                In([
                  SalesOrderStatusTypes.COMPLETE,
                  SalesOrderStatusTypes.MATCHING,
                  SalesOrderStatusTypes.CANCELLED,
                  SalesOrderStatusTypes.SP_COMPLETE,
                ]),
              )
            : SalesOrderStatusTypes.COMPLETE,
      },
      join: {
        alias: 'salesOrders',
        leftJoinAndSelect: {
          product: 'salesOrders.product',
          productCategory: 'product.productCategory',
        },
      },
      withDeleted: true,
      take: limit,
      skip,
    });
    // const salesOrder = (isCount: boolean) => ``;
    return {
      nodes: salesOrders.map((s) => {
        if (s.product?.deletedAt !== null) {
          s.deletedProduct = s.product;
          s.deletedProductCategory = s.product.productCategory;
        } else if (s.product?.productCategory.deletedAt !== null) {
          s.deletedProduct = s.product;
          s.deletedProductCategory = s.product.productCategory;
        } else {
          s.product = s.product;
        }

        return s;
      }),
      totalCount: count,
    };
  }
  @Mutation(() => SalesOrdersDTO)
  async updateSalesOrderStatus(
    @GqlAuthUser() user: AuthData,
    @Args('input') input: updateSalesOrderStatusInput,
  ) {
    const { salesOrderStatus, salesOrderId } = input;
    const salesOrderRecord = await this.salesOrderRepo.findOne({
      where: { id: salesOrderId },
      relations: {
        product: true,
      },
    });
    if (_.isEmpty(salesOrderRecord)) {
      throw new NotFoundException(`Sales Order record not found`);
    }
    if (
      salesOrderStatus === SalesOrderStatusTypes.PENDING_SERVICE ||
      salesOrderStatus === SalesOrderStatusTypes.PENDING_PAYMENT ||
      salesOrderStatus === SalesOrderStatusTypes.READY_TO_REDEEM ||
      salesOrderStatus === SalesOrderStatusTypes.MATCHING
    ) {
      throw new BadRequestException(`Sales Order status cannot be changed to ${salesOrderStatus}`);
    }

    if (salesOrderStatus === SalesOrderStatusTypes.COMPLETE) {
      const serviceProofData = await this.salesOrderServiceProofRepo.find({
        where: { salesOrderId },
      });
      if (_.isEmpty(serviceProofData)) {
        throw new BadRequestException(`Please upload the image to confirm the job is complete`);
      }

      salesOrderRecord.salesOrderStatus = salesOrderStatus;
      await this.salesOrderRepo.save(salesOrderRecord);

      if (salesOrderRecord.product.type === 'PROMOTIONAL') {
        await this.spTransactionRepo.save({
          type: serviceProviderTransactionEnum.SERVICE_TRANSACTION,
          amount: salesOrderRecord.grandTotal,
          serviceProviderId: salesOrderRecord.serviceProviderId,
        });
      }
    } else {
      salesOrderRecord.salesOrderStatus = salesOrderStatus;
      await this.salesOrderRepo.save(salesOrderRecord);
    }

    return salesOrderRecord;
  }

  @Query(() => [CheckDailyGrandTotalDTO], { nullable: true })
  async getDailySalesOrderTotal(@Args('input') input: filterDateInput) {
    const { startDate, endDate, limit, offset } = input;
    const data = await this.salesOrderRepo.query(
      `SELECT CAST(so.createdAt as date) as date, SUM(so.grandTotal) as amount
       FROM sales_orders so
       LEFT JOIN products p ON p.id = so.productId and p.deletedAt is NULL
       WHERE so.deletedAt IS NULL
       ${input.productCategoryId ? ` AND p.categoryId = ${input.productCategoryId}` : ''}
       AND so.paymentStatus = 'PAID' 
       ${startDate ? `AND so.createdAt >= '${moment(startDate).startOf('days').format()}'` : ''}
       ${endDate ? `AND so.createdAt <= '${moment(endDate).endOf('days').format()}'` : ''}
       GROUP BY DAY(so.createdAt)
       ORDER BY so.createdAt ASC
       LIMIT ${limit}
       OFFSET ${offset}
      `,
    );

    return data;
  }

  @Query(() => [CheckDailyGrandTotalDTO], { nullable: true })
  async getDailySalesOrderCountTotal(@Args('input') input: filterDateInput) {
    const { startDate, endDate, limit, offset } = input;
    const data = await this.salesOrderRepo.query(
      `SELECT CAST(so.createdAt as date) as date, COUNT(so.id) as amount
       FROM sales_orders so
       LEFT JOIN products p ON p.id = so.productId and p.deletedAt is NULL
       WHERE so.deletedAt IS NULL
       ${input.productCategoryId ? ` AND p.categoryId = ${input.productCategoryId}` : ''}
       AND so.paymentStatus = 'PAID' 
       ${startDate ? `AND so.createdAt >= '${moment(startDate).startOf('days').format()}'` : ''}
       ${endDate ? `AND so.createdAt <= '${moment(endDate).endOf('days').format()}'` : ''}
       GROUP BY DAY(so.createdAt)
       ORDER BY so.createdAt ASC
       LIMIT ${limit}
       OFFSET ${offset}
      `,
    );

    return data;
  }

  @Mutation(() => SalesOrdersDTO, { nullable: true })
  async customBookQuotation(
    @GqlAuthUser() auth: AuthData,
    @Args('input') input: CustomBookQuotationInput,
  ) {
    //@ts-ignore
    const salesOrderData = await this.salesOrderRepo.save({
      ...input,
      customerId: auth.id,
      salesOrderGalleries: input?.salesOrderFiles,
      salesOrderStatus: SalesOrderStatusTypes.MATCHING,
    });

    const customer = await this.customerRepo.findOne({ where: { id: auth.id } });
    // const latitude = _.toNumber(customer.latitude);
    // const longitude = _.toNumber(customer.longitude);
    // const spLatitude = 'CAST(sp.latitude as DECIMAL(10,7))';
    // const spLongitude = 'CAST(sp.longitude as DECIMAL(10,7))';
    // const countDistance = `
    //     ROUND(111.111 * DEGREES(ACOS(LEAST(1.0, COS(RADIANS(${latitude}))
    //     * COS(RADIANS(${spLatitude}))
    //     * COS(RADIANS(${longitude} - ${spLongitude} ))
    //     + SIN(RADIANS(${latitude})) * SIN(RADIANS(${spLatitude}))))), 2)`;

    const customerAddress = await this.customerAddressRepo.findOne({
      where: { id: input.customerAddressId },
    });

    console.log('------------------------');
    const rawData = await this.salesOrderRepo.query(`
          select sp.id as id, AVG(spr.rate) as rate
          from service_providers sp
          left join service_providers_ratings spr ON spr.serviceProviderId = sp.id
          left join products p ON p.serviceProviderId = sp.id AND p.deletedAt IS NULL
          left join service_areas sa ON sa.serviceProviderId = sp.id AND sa.deletedAt IS NULL
          WHERE sp.deletedAt IS NULL
          AND p.serviceProviderId = sp.id
          AND sp.isActive = 1
          AND sp.isBanned = 0
          AND p.productId = ${input.productId}
          AND sa.area = '${customerAddress.area}'
          GROUP BY sp.id
          ORDER BY rate DESC
          `);

    console.log(`
          select sp.id as id, AVG(spr.rate) as rate
          from service_providers sp
          left join service_providers_ratings spr ON spr.serviceProviderId = sp.id
          left join products p ON p.serviceProviderId = sp.id AND p.deletedAt IS NULL
          left join service_areas sa ON sa.serviceProviderId = sp.id AND sa.deletedAt IS NULL
          WHERE sp.deletedAt IS NULL
          AND p.serviceProviderId = sp.id
          AND sp.isActive = 1
          AND sp.isBanned = 0
          AND p.productId = ${input.productId}
          AND sa.area = '${customerAddress.area}'
          GROUP BY sp.id
          ORDER BY rate DESC
          `);
    // AND sp.serviceLocation = '${entity.area}'
    // AND 50 >= ${countDistance}
    for (let i = 0; i < rawData.length; i++) {
      const productData = await this.productRepo.findOne({
        where: { productId: input.productId, serviceProviderId: rawData[i].id },
      });

      if (!_.isEmpty(productData)) {
        const salesOrderMatch = await this.salesOrderMatchRepo.save({
          serviceProviderId: rawData[i].id,
          productId: productData.id,
          //@ts-ignore
          salesOrderId: salesOrderData.id,
          expiryDate: moment().add(12, 'hours').toDate(),
        });

        const orderItem = await this.orderItemRepo.find({
          //@ts-ignore
          where: { salesOrderId: salesOrderData.id },
        });

        for (let oI = 0; oI < orderItem.length; oI++) {
          const productOptionCategory = await this.productOptionCategoriesRepo.find({
            where: { productId: productData.id },
          });

          for (let ii = 0; ii < productOptionCategory.length; ii++) {
            const productOptionData = await this.productOptionRepo.find({
              where: {
                productOptionCategoryId: productOptionCategory[ii].id,
                name: orderItem[oI].itemName,
              },
            });
            for (let iii = 0; iii < productOptionData.length; iii++) {
              await this.salesOrderRepo.manager.getRepository(SalesOrderMatchesItemsEntity).save({
                salesOrderMatchId: salesOrderMatch.id,
                unitPrice: productOptionData[iii].price,
                itemName: productOptionData[iii].name,
              });
            }
          }
        }

        await this.spNotificationRepo.save({
          serviceProviderId: rawData[i].id,
          title: 'New Job Found',
          content: 'A new customer found that match your service provided',
          deeplink: `tukanggosp://service-provider/job-found/${salesOrderMatch.id}`,
        });
      }
    }
    return salesOrderData;
  }
}
