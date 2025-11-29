import { DataSource, EntitySubscriberInterface, EventSubscriber } from 'typeorm';

import { ServiceProvidersRatingsEntity } from './service-providers-ratings.entity';

@EventSubscriber()
export class ServiceProvidersRatingsSubscriber
  implements EntitySubscriberInterface<ServiceProvidersRatingsEntity>
{
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return ServiceProvidersRatingsEntity;
  }
}
