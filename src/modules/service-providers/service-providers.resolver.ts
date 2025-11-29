import { BadRequestException, NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Filter } from '@nestjs-query/core';
import { ConnectionType, QueryOptions } from '@nestjs-query/query-graphql';

import {
  getCreditBalanceDTO,
  getMyOrderStatusDTO,
  ServiceProvidersDTO,
  ServiceProvidersEntity,
} from './service-providers.entity';
import {
  ServiceProvidersConnection,
  ServiceProvidersQuery,
  CustomCreateManyServiceProvidersInput,
  CustomCreateOneServiceProvidersInput,
  CustomDeleteOneServiceProvidersInput,
  CustomFindOneServiceProvidersArgs,
  CustomUpdateOneServiceProvidersInput,
  ServiceProvidersUpdateMeInput,
  getMyJobInfoInput,
  ServiceProvidersAcceptJobInput,
  SelectProviderServiceInput,
  serviceProviderOnboardingInput,
} from './service-providers.input';
import { ServiceProvidersService } from './service-providers.service';
import { authData, GqlAuthUser } from '@modules/auth';
import { AuthData } from '@types';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { In, IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import {
  CustomerNotificationsEntity,
  GetMyJobDto,
  OrderItemsEntity,
  ProductDTO,
  ProductOptionEntity,
  ProductOptionsCategoriesEntity,
  ProductsEntity,
  SalesOrderMatchDTO,
  SalesOrderMatchesEntity,
  SalesOrderMatchesItemsEntity,
  SalesOrdersDTO,
  SalesOrdersEntity,
  ServiceProvidersNotificationsEntity,
  ServiceProvidersTransactionEntity,
} from '@entities';
import { GqlAuthGuard } from '@guards/auth.guard';
import moment from 'moment';
import { uploadReadableStreamToS3 } from '@providers/s3.service';
import { SalesOrderMatchesTypes } from '@modules/sales-order-matches/sales-order-matches-enum';
import { PaymentStatusTypes, SalesOrderStatusTypes } from '@modules/sales-orders';

@UseGuards(GqlAuthGuard)
@Resolver(() => ServiceProvidersDTO)
export class ServiceProvidersResolver {
  constructor(
    private readonly serviceProvidersService: ServiceProvidersService,
    @InjectRepository(ServiceProvidersEntity)
    private serviceProviderRepo: Repository<ServiceProvidersEntity>,
    @InjectRepository(ServiceProvidersNotificationsEntity)
    private spNotificationRepo: Repository<ServiceProvidersNotificationsEntity>,
    @InjectRepository(ServiceProvidersTransactionEntity)
    private spTransactionRepo: Repository<ServiceProvidersTransactionEntity>,
    @InjectRepository(SalesOrdersEntity)
    private salesOrderRepo: Repository<SalesOrdersEntity>,
    @InjectRepository(OrderItemsEntity)
    private orderItemRepo: Repository<OrderItemsEntity>,
    @InjectRepository(SalesOrderMatchesEntity)
    private salesOrderMatchesRepo: Repository<SalesOrderMatchesEntity>,
    @InjectRepository(ProductOptionsCategoriesEntity)
    private productOptionCategoriesRepo: Repository<ProductOptionsCategoriesEntity>,
    @InjectRepository(ProductOptionEntity)
    private productOptionRepo: Repository<ProductOptionEntity>,
    @InjectRepository(ProductsEntity)
    private productRepo: Repository<ProductsEntity>,
  ) {}

  @Query(() => ServiceProvidersDTO)
  async customFindOneServiceProviders(@Args() input: CustomFindOneServiceProvidersArgs) {
    return await this.serviceProviderRepo.findOne({ where: { id: _.toNumber(input.id) } });
  }

  @Query(() => ServiceProvidersDTO)
  async serviceProviderGetMeInfo(@GqlAuthUser() user: AuthData) {
    return await this.serviceProviderRepo.findOne({
      where: { id: user.id },
    });
  }

  @Query(() => getMyOrderStatusDTO)
  async getMyOrderStatus(@GqlAuthUser() user: AuthData) {
    // const totalRequest = await this.salesOrderMatchesRepo.count({
    //   where: { serviceProviderId: user.id, status: SalesOrderMatchesTypes.PENDING },
    // });
    const totalRequest = await this.salesOrderMatchesRepo.query(`
      SELECT COUNT(sales_orders.id) as count
      FROM sales_order_matches
      Left JOIN sales_orders ON sales_orders.id = sales_order_matches.salesOrderId 
      AND sales_orders.salesOrderMatchId IS NULL 
      AND sales_orders.salesOrderStatus = 'MATCHING'
      AND sales_orders.deletedAt IS NULL
      WHERE sales_order_matches.deletedAt IS NULL
      AND sales_order_matches.serviceProviderId = ${user.id}
      AND sales_order_matches.status = 'PENDING'
      AND sales_orders.matchValidity > '${moment().format()}'
      AND sales_orders.preferredDateTime > '${moment().format()}'
    `);

    const totalMatching = await this.salesOrderMatchesRepo.query(`
      SELECT COUNT(sales_orders.id) as count
      FROM sales_order_matches
      Left JOIN sales_orders ON sales_orders.id = sales_order_matches.salesOrderId 
      AND sales_orders.salesOrderMatchId IS NULL 
      AND sales_orders.salesOrderStatus = 'MATCHING'
      AND sales_orders.deletedAt IS NULL
      WHERE sales_order_matches.deletedAt IS NULL
      AND sales_order_matches.serviceProviderId = ${user.id}
      AND sales_order_matches.status = 'ACCEPT'
    `);

    const totalActive = await this.salesOrderRepo.count({
      where: {
        serviceProviderId: user.id,
        salesOrderStatus: In([
          SalesOrderStatusTypes.PENDING_SERVICE,
          SalesOrderStatusTypes.READY_TO_REDEEM,
          SalesOrderStatusTypes.IN_PROGRESS,
          SalesOrderStatusTypes.SP_IN_PROGRESS,
          SalesOrderStatusTypes.SP_COMPLETE,
        ]),
      },
    });

    const totalCompleted = await this.salesOrderRepo.count({
      where: {
        serviceProviderId: user.id,
        // salesOrderMatchId: Not(IsNull()),
        salesOrderStatus: SalesOrderStatusTypes.COMPLETE,
      },
    });

    return {
      totalRequest: totalRequest[0].count | 0,
      totalMatching: totalMatching[0].count | 0,
      totalActive: totalActive | 0,
      totalCompleted: totalCompleted | 0,
    };
  }

  @Mutation(() => ServiceProvidersDTO)
  async serviceProviderUpdateMeInfo(
    @GqlAuthUser() authData: AuthData,
    @Args('file', { type: () => GraphQLUpload, nullable: true }) file: FileUpload,
    @Args('companyDocument', { type: () => GraphQLUpload, nullable: true })
    companyDocument: FileUpload,
    @Args('bankSupportingDocument', { type: () => GraphQLUpload, nullable: true })
    bankSupportingDocument: FileUpload,
    @Args('input') input: ServiceProvidersUpdateMeInput,
  ) {
    const {
      fullName,
      phoneNo,
      phoneCountryCode,
      companyName,
      companySSM,
      jobTitle,
      fcmToken,
      bankName,
      bankAccountNo,
      bankReceiver,
      serviceLocation,
      personalIC,
    } = input;
    const serviceProvider = await this.serviceProviderRepo.findOne({ where: { id: authData.id } });

    if (file && _.isObject(file)) {
      console.log('----- is File');
      const { filename, createReadStream } = file as FileUpload;
      const { Location } = await uploadReadableStreamToS3(
        createReadStream(),
        'service-provider/profile-picture/',
        filename,
        {
          publicAccess: true,
        },
      );
      serviceProvider.profilePicture = Location;
    } else {
      console.log('----- Else is File');
      if (_.isEmpty(serviceProvider.profilePicture)) {
        serviceProvider.profilePicture =
          'https://tukang-go-dev.s3.ap-northeast-1.amazonaws.com/dev/service-provider/profile-picture/84399dfa-ec2b-4236-93a2-67103ff106af.png';
      }
    }
    if (bankSupportingDocument && _.isObject(bankSupportingDocument)) {
      console.log('----- is Bank');
      const { filename, createReadStream } = bankSupportingDocument as FileUpload;
      const { Location } = await uploadReadableStreamToS3(
        createReadStream(),
        'service-provider/bank-document/',
        filename,
        {
          publicAccess: true,
        },
      );
      serviceProvider.bankSupportingDocument = Location;
    }
    if (companyDocument && _.isObject(companyDocument)) {
      console.log('----- is Company');
      const { filename, createReadStream } = companyDocument as FileUpload;
      const { Location } = await uploadReadableStreamToS3(
        createReadStream(),
        'service-provider/company-document/',
        filename,
        {
          publicAccess: true,
        },
      );
      serviceProvider.companyDocument = Location;
    }

    serviceProvider.fullName = fullName;
    serviceProvider.phoneCountryCode = phoneCountryCode;
    serviceProvider.phoneNo = phoneNo;
    serviceProvider.companyName = companyName;
    serviceProvider.companySSM = companySSM;
    serviceProvider.jobTitle = jobTitle;
    serviceProvider.fcmToken = fcmToken;
    serviceProvider.bankName = bankName;
    serviceProvider.bankAccountNo = bankAccountNo;
    serviceProvider.bankReceiver = bankReceiver;
    serviceProvider.serviceLocation = serviceLocation;
    serviceProvider.personalIC = input?.personalIC;
    serviceProvider.email = input?.email;
    serviceProvider.providerType = input?.providerType;
    serviceProvider.address = input?.address;

    return this.serviceProviderRepo.save(serviceProvider);
  }

  @Query(() => getCreditBalanceDTO, { nullable: true })
  async getCreditBalance(@GqlAuthUser() authData: AuthData) {
    const salesOrder = await this.spTransactionRepo.find({
      where: {
        serviceProviderId: authData.id,
        disbursementId: IsNull(),
      },
    });
    const totalCredit =
      _.sumBy(salesOrder, (i) => {
        return _.toNumber(i.amount);
      }) || 0;

    return { totalCreditBalance: totalCredit };
  }
  @Mutation(() => SalesOrderMatchDTO)
  async serviceProviderAcceptJob(
    @GqlAuthUser() authData: AuthData,
    @Args('quotationFile', { type: () => GraphQLUpload, nullable: true }) quotationFile: FileUpload,
    @Args('input') input: ServiceProvidersAcceptJobInput,
  ) {
    const { jobStatus, salesOrderId } = input;

    if (jobStatus == SalesOrderMatchesTypes.PENDING) {
      throw new BadRequestException(`cant change status to pending`);
    }

    const sp = await this.serviceProviderRepo.findOne({ where: { id: authData.id } });
    if (!sp.isActive && jobStatus == SalesOrderMatchesTypes.ACCEPT) {
      throw new BadRequestException(`You cannot accept the job due to your account is inactive`);
    }

    const salesOrder = await this.salesOrderRepo.findOne({ where: { id: salesOrderId } });
    if (_.isEmpty(salesOrder)) {
      throw new NotFoundException(`Sales order not found`);
    }

    const product = await this.productRepo.findOne({
      where: { productId: salesOrder.productId, serviceProviderId: authData.id },
    });

    if (_.isEmpty(product)) {
      throw new NotFoundException(`Product not found`);
    }

    const salesOrderMatchRecord = await this.salesOrderMatchesRepo.findOne({
      where: { salesOrderId: salesOrderId, serviceProviderId: authData.id },
    });

    if (_.isEmpty(salesOrderMatchRecord)) {
      throw new Error(`Match not found`);
    }
    if (salesOrderMatchRecord.status !== SalesOrderMatchesTypes.PENDING) {
      throw new BadRequestException(`Sales Order Match status cant be change`);
    }

    // if (
    //   salesOrderMatchRecord.expiryDate < moment().toDate() &&
    //   input.jobStatus === SalesOrderMatchesTypes.ACCEPT
    // ) {
    //   salesOrderMatchRecord.status = SalesOrderMatchesTypes.CANCELLED;
    //   await this.salesOrderMatchesRepo.save(salesOrderMatchRecord);
    //   throw new BadRequestException(`The order match time has be expired`);
    // }

    if (jobStatus === SalesOrderMatchesTypes.ACCEPT) {
      if (quotationFile && _.isObject(quotationFile)) {
        const { filename, createReadStream } = (await quotationFile) as FileUpload;
        const { Location } = await uploadReadableStreamToS3(
          createReadStream(),
          'sales-order-matches/quotation-file/',
          filename,
          { publicAccess: true },
        );
        salesOrderMatchRecord.quotationFile = Location;
      }
      // salesOrderMatchRecord.grandTotal = !_.isEmpty(input.grandTotal)
      //   ? input.grandTotal
      //   : product.retailPrice;
      // salesOrderMatchRecord.subtotal = product.originalPrice;
      // salesOrderMatchRecord.discountTotal = product.discount;
      salesOrderMatchRecord.status = SalesOrderMatchesTypes.ACCEPT;

      const salesOrderMatch = await this.salesOrderRepo.manager
        .getRepository(SalesOrderMatchesEntity)
        .save(salesOrderMatchRecord);

      // const orderItem = await this.orderItemRepo.find({
      //   where: { salesOrderId: salesOrderMatchRecord.salesOrderId },
      // });

      // for (let oI = 0; oI < orderItem.length; oI++) {
      //   const productOptionCategory = await this.productOptionCategoriesRepo.find({
      //     where: { productId: product.id },
      //   });

      //   for (let ii = 0; ii < productOptionCategory.length; ii++) {
      //     const productOptionData = await this.productOptionRepo.find({
      //       where: {
      //         productOptionCategoryId: productOptionCategory[ii].id,
      //         name: orderItem[oI].itemName,
      //       },
      //     });
      //     for (let iii = 0; iii < productOptionData.length; iii++) {
      //       await this.salesOrderRepo.manager.getRepository(SalesOrderMatchesItemsEntity).save({
      //         salesOrderMatchId: salesOrderMatchRecord.id,
      //         unitPrice: productOptionData[iii].price,
      //         itemName: productOptionData[iii].name,
      //       });
      //     }
      //   }
      // }

      // const matchItems = await this.salesOrderRepo.manager
      //   .getRepository(SalesOrderMatchesItemsEntity)
      //   .find({ where: { salesOrderMatchId: salesOrderMatchRecord.id } });
      // const totalAmount =
      //   _.sumBy(matchItems, (o) => {
      //     return _.toNumber(o.unitPrice);
      //   }) || 0;
      // salesOrderMatchRecord.subtotal = input.grandTotal;
      // salesOrderMatchRecord.discountTotal = input.grandTotal;
      // salesOrderMatchRecord.grandTotal = input.grandTotal;
      // const salesOrderMatch = await this.salesOrderRepo.manager
      //   .getRepository(SalesOrderMatchesEntity)
      //   .save(salesOrderMatchRecord);

      // const productOptionCategory = await this.productOptionCategoriesRepo.find({
      //   where: { productId: product.id },
      // });
      // _.map(productOptionCategory, async (productOptionCategory) => {
      //   const productOptionData = await this.productOptionRepo.find({
      //     where: { productOptionCategoryId: productOptionCategory.id },
      //   });
      //   _.map(productOptionData, async (po) => {
      //     await this.salesOrderRepo.manager.getRepository(SalesOrderMatchesItemsEntity).save({
      //       salesOrderMatchId: salesOrderMatch.id,
      //       itemName: po.name,
      //       unitPrice: po.price,
      //     });
      //   });
      // });

      await this.salesOrderRepo.manager.getRepository(CustomerNotificationsEntity).save({
        customerId: salesOrder.customerId,
        title: 'Tukang Matched',
        content:
          "We've found a Tukang for you. Please accept the Tukang, they will call you as soon as possible",
        deeplink: `tukanggo://job-summary/${salesOrderId}`,
      });

      return salesOrderMatch;
    } else {
      salesOrderMatchRecord.status = SalesOrderMatchesTypes.REJECT;
      const salesOrderMatch = await this.salesOrderRepo.manager
        .getRepository(SalesOrderMatchesEntity)
        .save(salesOrderMatchRecord);

      return salesOrderMatch;
    }
  }

  @Mutation(() => ProductDTO, { nullable: true })
  async serviceProviderDeleteService(
    @GqlAuthUser() authData: AuthData,
    @Args('productId') productId: number,
  ) {
    // const product = await this.productRepo.findOne({
    //   where: { serviceProviderId: authData.id, productId },
    // });

    // if (_.isEmpty(product)) throw new BadRequestException(`This service is not be selected`);

    await this.productRepo.softDelete({ serviceProviderId: authData.id, productId });
  }

  @Mutation(() => Boolean)
  async spReadAllNotification(@GqlAuthUser() authData: AuthData) {
    await this.spNotificationRepo.update(
      { serviceProviderId: authData.id, isRead: false },
      { isRead: true },
    );
    return true;
  }
  @Mutation(() => ServiceProvidersDTO)
  async serviceProviderOnboarding(
    @GqlAuthUser() authData: AuthData,
    @Args('input') input: serviceProviderOnboardingInput,
  ) {
    try {
      const serviceProvider = await this.serviceProviderRepo.findOneOrFail({
        where: { id: authData.id },
      });

      let location;
      if (input.companyDocument && _.isObject(input.companyDocument)) {
        const { filename, createReadStream } = (await input.companyDocument) as FileUpload;
        const { Location } = await uploadReadableStreamToS3(
          createReadStream(),
          'company-document/',
          filename,
          { publicAccess: true },
        );

        location = Location;
        serviceProvider.companyDocument = location;
      }
      if (!_.isEmpty(input.email) && serviceProvider.email !== input.email) {
        serviceProvider.email = input.email;
      }

      serviceProvider.companyName = input.companyName;
      serviceProvider.companySSM = input.companySSM;
      serviceProvider.serviceLocation = input?.serviceLocation;
      serviceProvider.fullName = input.fullName;
      serviceProvider.personalIC = input?.personalIC;
      serviceProvider.providerType = input.providerType;
      await this.serviceProviderRepo.save(serviceProvider);

      return serviceProvider;
    } catch (e) {
      console.error(e);
      throw new Error(e);
    }
  }
}
