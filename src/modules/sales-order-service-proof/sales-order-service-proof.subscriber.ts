import { SalesOrdersEntity } from '@entities';
import { SalesOrderStatusTypes } from '@modules/sales-orders';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { uploadReadableStreamToS3 } from '@providers/s3.service';
import { FileUpload } from 'graphql-upload';
import _ from 'lodash';
import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';

import { SalesOrderServiceProofEntity } from './sales-order-service-proof.entity';

@EventSubscriber()
export class SalesOrderServiceProofSubscriber
  implements EntitySubscriberInterface<SalesOrderServiceProofEntity>
{
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return SalesOrderServiceProofEntity;
  }

  async beforeInsert(event: InsertEvent<SalesOrderServiceProofEntity>) {
    const { entity } = event;

    const salesOrderData = await event.manager
      .getRepository(SalesOrdersEntity)
      .findOne({ where: { id: entity.salesOrderId } });
    if (_.isEmpty(salesOrderData)) throw new NotFoundException(`Record not found`);

    // if (salesOrderData.salesOrderStatus === SalesOrderStatusTypes.COMPLETE) {
    if (entity.imageUrl && _.isObject(entity.imageUrl)) {
      const { filename, createReadStream } = (await entity.imageUrl) as FileUpload;
      const { Location } = await uploadReadableStreamToS3(
        createReadStream(),
        'sales-order/service-proof/',
        filename,
        { publicAccess: true },
      );
      entity.imageUrl = Location;
    } else {
      throw new BadRequestException(`Please Upload a Photo to continue`);
    }
    // } else {
    //   throw new BadRequestException(`The Record is no mark as completed`);
    // }
  }
}
