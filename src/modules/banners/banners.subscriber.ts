/* eslint-disable max-len */
import { CustomerNotificationsEntity, CustomersEntity } from '@entities';
import { InjectRepository } from '@nestjs/typeorm';
import { firebaseApp } from '@providers/firebase.service';
import { uploadReadableStreamToS3 } from '@providers/s3.service';
import { FileUpload } from 'graphql-upload';
import _ from 'lodash';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  getRepository,
  InsertEvent,
  IsNull,
  Not,
  Repository,
  UpdateEvent,
} from 'typeorm';

import { BannersEntity } from './banners.entity';

@EventSubscriber()
export class BannersSubscriber implements EntitySubscriberInterface<BannersEntity> {
  constructor(
    dataSource: DataSource,
    @InjectRepository(CustomersEntity) private customerRepo: Repository<CustomersEntity>,
    @InjectRepository(CustomerNotificationsEntity)
    private customerNotificationRepo: Repository<CustomerNotificationsEntity>,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return BannersEntity;
  }

  async beforeInsert(event: InsertEvent<BannersEntity>) {
    const { entity } = event;
    if (entity.bannerUrl && _.isObject(entity.bannerUrl)) {
      const { filename, createReadStream } = (await entity.bannerUrl) as FileUpload;
      const { Location } = await uploadReadableStreamToS3(
        createReadStream(),
        'banners/',
        filename,
        { publicAccess: true },
      );
      entity.bannerUrl = Location;
    }
  }

  async beforeUpdate(event: UpdateEvent<BannersEntity>) {
    const { entity } = event;
    if (entity.bannerUrl && _.isObject(entity.bannerUrl)) {
      const { filename, createReadStream } = (await entity.bannerUrl) as FileUpload;
      const { Location } = await uploadReadableStreamToS3(
        createReadStream(),
        'banners/',
        filename,
        { publicAccess: true },
      );
      entity.bannerUrl = Location;
    }
  }

  async afterInsert(event: InsertEvent<BannersEntity>) {
    const { entity } = event;
    const notifications = await event.manager.getRepository(CustomerNotificationsEntity);
    const customer = await event.manager
      .getRepository(CustomersEntity)
      .find({ where: { fcmToken: Not(IsNull()) } });
    const banner = await event.manager
      .getRepository(BannersEntity)
      .findOne({ where: { id: entity.id } });
    const title = 'New Announcement';
    const content = entity.content;
    // const deeplink = `tukanggo://banner/${entity.id}`;
    // banner.deeplink = deeplink;
    await event.manager.getRepository(BannersEntity).save(banner);

    if (!_.isEmpty(entity.deeplink)) {
      for (let i = 0; i < customer.length; i++) {
        await notifications.save({
          customerId: customer[i].id,
          title,
          content,
          deeplink: entity.deeplink,
        });
      }
    }
  }
}
