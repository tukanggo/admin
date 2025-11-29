import { DataSource, EntitySubscriberInterface, EventSubscriber } from 'typeorm';

import { SettingsEntity } from './settings.entity';

@EventSubscriber()
export class SettingsSubscriber implements EntitySubscriberInterface<SettingsEntity> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return SettingsEntity;
  }
}
