import {
  CustomerNotificationsEntity,
  SalesOrderMatchesEntity,
  SalesOrdersEntity,
  ServiceProvidersNotificationsEntity,
} from '@entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './task.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      SalesOrdersEntity,
      SalesOrderMatchesEntity,
      CustomerNotificationsEntity,
      ServiceProvidersNotificationsEntity,
    ]),
  ],
  providers: [TasksService],
})
export class TasksModule {}
