import { CustomersEntity } from '@entities';
import { InjectRepository } from '@nestjs/typeorm';
import { firebaseApp } from '@providers/firebase.service';
import { uploadReadableStreamToS3 } from '@providers/s3.service';
import { FileUpload } from 'graphql-upload';
import _ from 'lodash';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  Repository,
  UpdateEvent,
} from 'typeorm';

import { CustomerNotificationsEntity } from './customer-notifications.entity';

@EventSubscriber()
export class CustomerNotificationsSubscriber
  implements EntitySubscriberInterface<CustomerNotificationsEntity>
{
  constructor(
    dataSource: DataSource,
    @InjectRepository(CustomersEntity) private customerRepo: Repository<CustomersEntity>,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return CustomerNotificationsEntity;
  }

  async beforeInsert(event: InsertEvent<CustomerNotificationsEntity>) {
    const { entity } = event;
    const customer = await this.customerRepo.findOne({ where: { id: entity.customerId } });

    if (_.isEmpty(customer)) {
      throw new Error(`Customer not found`);
    }
    if (entity.thumbnail && _.isObject(entity.thumbnail)) {
      const { filename, createReadStream } = (await entity.thumbnail) as FileUpload;
      const { Location } = await uploadReadableStreamToS3(
        createReadStream(),
        'notification/customers/',
        filename,
        { publicAccess: true },
      );
      entity.thumbnail = Location;
    }

    if (customer.fcmToken) {
      firebaseApp.messaging().send({
        token: customer.fcmToken,
        notification: {
          title: entity.title,
          body: entity.content,
        },
        data: { deeplink: `tukanggo://notification/customer/${customer.id}` },
        android: { priority: 'high', notification: { sound: 'default' } },
        apns: { headers: { 'apns-priority': '10' }, payload: { aps: { sound: 'default' } } },
      });
    }
  }

  async beforeUpdate(event: UpdateEvent<CustomerNotificationsEntity>) {
    const { entity } = event;
    if (entity.thumbnail && _.isObject(entity.thumbnail)) {
      const { filename, createReadStream } = (await entity.thumbnail) as FileUpload;
      const { Location } = await uploadReadableStreamToS3(
        createReadStream(),
        'notification/customers/',
        filename,
        { publicAccess: true },
      );
      entity.thumbnail = Location;
    }
  }
}
