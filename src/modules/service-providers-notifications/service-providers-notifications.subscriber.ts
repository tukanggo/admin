import { ServiceProvidersEntity } from '@entities';
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

import { ServiceProvidersNotificationsEntity } from './service-providers-notifications.entity';

@EventSubscriber()
export class ServiceProvidersNotificationsSubscriber
  implements EntitySubscriberInterface<ServiceProvidersNotificationsEntity>
{
  constructor(
    dataSource: DataSource,
    @InjectRepository(ServiceProvidersEntity)
    private serviceProviderRepo: Repository<ServiceProvidersEntity>,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return ServiceProvidersNotificationsEntity;
  }

  async beforeInsert(event: InsertEvent<ServiceProvidersNotificationsEntity>) {
    const { entity } = event;
    const serviceProvider = await this.serviceProviderRepo.findOne({
      where: { id: entity.serviceProviderId },
    });
    if (_.isEmpty(serviceProvider)) {
      throw new Error('service provider not found');
    }
    if (serviceProvider.isActive == false || serviceProvider.isBanned == true) {
      return;
    }

    if (entity.thumbnail && _.isObject(entity.thumbnail)) {
      const { filename, createReadStream } = (await entity.thumbnail) as FileUpload;
      const { Location } = await uploadReadableStreamToS3(
        createReadStream(),
        'notification/service-providers/',
        filename,
        { publicAccess: true },
      );
      entity.thumbnail = Location;
    }

    if (serviceProvider.fcmToken) {
      firebaseApp.messaging().send({
        token: serviceProvider.fcmToken,
        notification: {
          title: entity.title,
          body: entity.content,
        },
        data: { deeplink: entity.deeplink },
        android: { priority: 'high', notification: { sound: 'default' } },
        apns: { headers: { 'apns-priority': '10' }, payload: { aps: { sound: 'default' } } },
      });
    }
  }

  async beforeUpdate(event: UpdateEvent<ServiceProvidersNotificationsEntity>) {
    const { entity } = event;
    if (entity.thumbnail && _.isObject(entity.thumbnail)) {
      const { filename, createReadStream } = (await entity.thumbnail) as FileUpload;
      const { Location } = await uploadReadableStreamToS3(
        createReadStream(),
        'notification/service-providers/',
        filename,
        { publicAccess: true },
      );
      entity.thumbnail = Location;
    }
  }
}
