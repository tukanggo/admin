import { ServiceProvidersRatingsEntity } from '@entities';
import { hashPassword } from '@providers/bcrypt.service';
import { uploadReadableStreamToS3 } from '@providers/s3.service';
import { FileUpload } from 'graphql-upload';
import _ from 'lodash';
import { nanoid } from 'nanoid';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  getRepository,
  InsertEvent,
  LoadEvent,
  UpdateEvent,
} from 'typeorm';

import { ServiceProvidersEntity } from './service-providers.entity';

@EventSubscriber()
export class ServiceProvidersSubscriber
  implements EntitySubscriberInterface<ServiceProvidersEntity>
{
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return ServiceProvidersEntity;
  }

  async beforeInsert(event: InsertEvent<ServiceProvidersEntity>) {
    const { entity } = event;
    if (entity.profilePicture && _.isObject(entity.profilePicture)) {
      const { filename, createReadStream } = (await entity.profilePicture) as FileUpload;
      const { Location } = await uploadReadableStreamToS3(
        createReadStream(),
        'service-provider/profile-picture/',
        filename,
        { publicAccess: true },
      );
      entity.profilePicture = Location;
    }
  }

  async beforeUpdate(event: UpdateEvent<ServiceProvidersEntity>) {
    const { entity } = event;
    if (entity.profilePicture && _.isObject(entity.profilePicture)) {
      const { filename, createReadStream } = (await entity.profilePicture) as FileUpload;
      const { Location } = await uploadReadableStreamToS3(
        createReadStream(),
        'service-provider/profile-picture/',
        filename,
        { publicAccess: true },
      );
      entity.profilePicture = Location;
    }
  }

  async afterInsert(event: InsertEvent<ServiceProvidersEntity>) {
    const { entity } = event;

    await event.manager
      .getRepository(ServiceProvidersRatingsEntity)
      .save({ serviceProviderId: entity.id, rate: 5 });
  }

  async afterLoad(entity: ServiceProvidersEntity, event?: LoadEvent<ServiceProvidersEntity>) {
    if (!entity.id) return;
    const rawData = await event.manager.query(`   
    select sp.id as id, AVG(spr.rate) as rate
    from service_providers sp
    left join service_providers_ratings spr on spr.serviceProviderId = ${entity.id}
    WHERE sp.deletedAt IS NULL
    GROUP BY sp.id
    ORDER BY rate DESC
    limit 5
`);
    entity.rate = rawData[0].rate;
  }
}
