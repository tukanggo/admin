import {
  CustomersEntity,
  ProductItemsEntity,
  ProductOptionsCategoriesEntity,
  ProductOptionEntity,
  SalesOrderMatchesEntity,
  SalesOrderMatchesItemsEntity,
  ServiceProvidersNotificationsEntity,
  ProductsEntity,
  CustomerNotificationsEntity,
  ServiceProvidersEntity,
  CustomerAddressesEntity,
  OrderItemsEntity,
  ProductCategoriesEntity,
} from '@entities';
import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { uploadReadableStreamToS3 } from '@providers/s3.service';
import { FileUpload } from 'graphql-upload';
import _ from 'lodash';
import moment from 'moment';
import { customAlphabet, nanoid } from 'nanoid';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  Repository,
  UpdateEvent,
} from 'typeorm';

import { SalesOrdersEntity } from './sales-orders.entity';
import { SalesOrderStatusTypes } from './sales-orders.enum';

@EventSubscriber()
export class SalesOrdersSubscriber implements EntitySubscriberInterface<SalesOrdersEntity> {
  constructor(
    dataSource: DataSource,
    @InjectRepository(CustomersEntity) private customerRepo: Repository<CustomersEntity>,
    @InjectRepository(SalesOrdersEntity) private salesOrderRepo: Repository<SalesOrdersEntity>,
    @InjectRepository(SalesOrderMatchesItemsEntity)
    private salesOrderMatchItemRepo: Repository<SalesOrderMatchesItemsEntity>,
    @InjectRepository(ProductItemsEntity) private productItemRepo: Repository<ProductItemsEntity>,
    @InjectRepository(ProductOptionsCategoriesEntity)
    private productOptionCategoriesRepo: Repository<ProductOptionsCategoriesEntity>,
    @InjectRepository(ProductOptionEntity)
    private productOptionRepo: Repository<ProductOptionEntity>,
    @InjectRepository(OrderItemsEntity)
    private orderItemRepo: Repository<OrderItemsEntity>,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return SalesOrdersEntity;
  }

  async beforeInsert(event: InsertEvent<SalesOrdersEntity>) {
    const { entity } = event;
    const product = await event.manager
      .getRepository(ProductsEntity)
      .findOne({ where: { id: entity.productId } });

    const productCategory = await event.manager
      .getRepository(ProductCategoriesEntity)
      .findOne({ where: { id: product.categoryId } });

    if (!product.isApproved || !product.active) {
      throw new BadRequestException(`This product cannot be purchased now.`);
    }
    const user = await event.manager
      .getRepository(CustomersEntity)
      .findOne({ where: { id: entity.customerId } });
    if (!user.isActive) throw new BadRequestException(`This account has be suspended`);

    const customerAddress = await event.manager
      .getRepository(CustomerAddressesEntity)
      .findOne({ where: { id: entity.customerAddressId } });

    // const nanoid = customAlphabet(
    //   '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    //   8,
    // );

    entity.name = customerAddress.name;
    entity.address = customerAddress.address;
    entity.placeName = customerAddress.placeName;
    entity.area = customerAddress.area;
    entity.addressDetail = customerAddress.addressDetail;
    entity.remarks = customerAddress.remarks;
    entity.matchValidity = moment().add(24, 'hours').toDate();
    entity.productName = product.name;
    entity.productCategory = productCategory.name;
    entity.productType = product.type;
    entity.productPrice = product.retailPrice;
  }

  async beforeUpdate(event: UpdateEvent<SalesOrdersEntity>) {
    const { entity } = event;

    const soRecord = await this.salesOrderRepo.findOne({ where: { id: entity.id } });
    if (!_.isEmpty(soRecord)) {
      if (entity.salesOrderStatus !== soRecord.salesOrderStatus) {
        if (!_.isEmpty(entity.salesOrderStatus)) {
          const deeplink =
            entity.salesOrderStatus === SalesOrderStatusTypes.MATCHING ||
            entity.salesOrderStatus === SalesOrderStatusTypes.PENDING_PAYMENT
              ? `tukanggo://job-summary/${entity.id}`
              : `tukanggo://job-detail/${entity.id}`;

          // 'MATCHING',
          //   'PENDING_PAYMENT',
          //   'READY_TO_REDEEM',
          //   'PENDING_SERVICE',
          //   'SP_IN_PROGRESS',
          //   'IN_PROGRESS',
          //   'SP_COMPLETE',
          //   'COMPLETE',
          //   'CANCELLED';
          if (entity.salesOrderStatus === 'SP_IN_PROGRESS') {
            // await event.manager.getRepository(CustomerNotificationsEntity).save({
            //   customerId: entity.customerId,
            //   title: `Sales order #${entity.refNo} has been changed to ${entity.salesOrderStatus}`,
            //   content: `Press here to view the details`,
            //   deeplink,
            // });
            await event.manager.getRepository(CustomerNotificationsEntity).save({
              customerId: entity.customerId,
              title: 'Starting Work',
              content: `Order #${entity?.refNo} has started. The job will be finished by ${entity?.preferredDateTime}`,
              deeplink,
              // title: `Sales order #${entity.refNo} has been changed to ${entity.salesOrderStatus}`,
              // content: `Press here to view the details`,
            });
          }

          if (entity.salesOrderStatus === 'SP_COMPLETE') {
            await event.manager.getRepository(CustomerNotificationsEntity).save({
              customerId: entity.customerId,
              title: 'Job Completed',
              content: `Order #${entity?.refNo} has been completed. Please rate the Tukang`,
              deeplink,
              // title: `Sales order #${entity.refNo} has been changed to ${entity.salesOrderStatus}`,
              // content: `Press here to view the details`,
            });
          }

          if (entity.salesOrderStatus === 'MATCHING') {
            // await event.manager.getRepository(ServiceProvidersNotificationsEntity).save({
            //   serviceProviderId: entity.serviceProviderId,
            //   title: `Sales order #${entity.refNo} has been changed to ${entity.salesOrderStatus}`,
            //   content: `Press here to view the details`,
            //   deeplink: `tukanggosp://service-provider/job/${entity.id}`,
            // });
            await event.manager.getRepository(ServiceProvidersNotificationsEntity).save({
              serviceProviderId: entity.serviceProviderId,
              title: "You've got a new job!",
              content: `Order #${entity?.refNo} is ready for you to accept`,
              // title: `Sales order #${entity.refNo} has been changed to ${entity.salesOrderStatus}`,
              // content: `Press here to view the details`,
              deeplink: `tukanggosp://service-provider/job/${entity.id}`,
            });
          }
        }
      }
    }
  }

  async afterInsert(event: InsertEvent<SalesOrdersEntity>) {
    const { entity } = event;

    const Ref = _.toString(entity.id).padStart(6, '0');
    const refNo = `PO${moment().format('MM') + moment().format('DD') + Ref}`;

    await event.manager.getRepository(SalesOrdersEntity).update({ id: entity.id }, { refNo });

    const product = await event.manager
      .getRepository(ProductsEntity)
      .findOne({ where: { id: entity.productId } });

    if (!_.isEmpty(product)) {
      if (product.type === 'PROMOTIONAL') {
        entity.serviceProviderId = product.serviceProviderId;
        entity.salesOrderStatus = SalesOrderStatusTypes.PENDING_PAYMENT;
        entity.refNo = refNo;
        await event.manager.getRepository(SalesOrdersEntity).save(entity);
      } else if (product.type === 'INSTANT_BOOKING') {
        entity.serviceProviderId = product.serviceProviderId;
        entity.salesOrderStatus = SalesOrderStatusTypes.PENDING_PAYMENT;
        entity.refNo = refNo;
        await event.manager.getRepository(SalesOrdersEntity).save(entity);
      }
    }
  }
}
