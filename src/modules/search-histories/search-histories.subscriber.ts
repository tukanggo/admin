import { DataSource, EntitySubscriberInterface, EventSubscriber } from 'typeorm';

import { SearchHistoriesEntity } from './search-histories.entity';

@EventSubscriber()
export class SearchHistoriesSubscriber implements EntitySubscriberInterface<SearchHistoriesEntity> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return SearchHistoriesEntity;
  }
}
