import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, IsNull, LessThanOrEqual, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import moment from 'moment';
import {
  CustomerNotificationsEntity,
  SalesOrderMatchesEntity,
  SalesOrdersEntity,
  ServiceProvidersNotificationsEntity,
} from '@entities';
import { SalesOrderStatusTypes } from '@modules/sales-orders';
import _ from 'lodash';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(SalesOrdersEntity) private salesOrdersRepo: Repository<SalesOrdersEntity>,
    @InjectRepository(SalesOrderMatchesEntity)
    private salesOrderMathRepo: Repository<SalesOrderMatchesEntity>,
    @InjectRepository(CustomerNotificationsEntity)
    private customerNotificationRepo: Repository<CustomerNotificationsEntity>,
    @InjectRepository(ServiceProvidersNotificationsEntity)
    private spNotificationRepo: Repository<ServiceProvidersNotificationsEntity>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handelCron() {
    new Logger(`Cron Sales Order`).log(`Run checkSalesOrderMatchAvailability `);

    const salesOrder = await this.salesOrdersRepo.find({
      where: {
        salesOrderStatus: In([
          SalesOrderStatusTypes.PENDING_PAYMENT,
          // SalesOrderStatusTypes.MATCHING,
        ]),
        createdAt: Between(
          moment().subtract(2, 'd').toDate(),
          moment().subtract(2, 'd').add(1, 'minute').toDate(),
        ),
        // matchValidity: LessThan(moment().toDate()),
      },
    });

    if (!_.isEmpty(salesOrder)) {
      await Promise.all(
        _.map(salesOrder, async (i) => {
          await this.salesOrderMathRepo.softRemove({ salesOrderId: i.id });
          await this.salesOrdersRepo.softRemove({ id: i.id });
        }),
      );
    }
    new Logger(`Cron Sales Order`).log(`End checkSalesOrderMatchAvailability `);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handelDeleteMatchCron() {
    new Logger(`Cron Sales Order match`).log(`Run handelDeleteMatchCron`);

    const salesOrder = await this.salesOrdersRepo.find({
      where: {
        salesOrderMatchId: Not(IsNull()),
        createdAt: Between(
          moment().subtract(7, 'd').toDate(),
          moment().add(7, 'd').add(1, 'minute').toDate(),
        ),
      },
    });

    await Promise.all(
      _.map(salesOrder, async (i) => {
        const record = await this.salesOrderMathRepo.find({
          where: { id: Not(i.salesOrderMatchId), salesOrderId: i.id },
        });

        if (!_.isEmpty(record)) await this.salesOrderMathRepo.softRemove(record);
      }),
    );
    new Logger(`Cron Sales Order`).log(`End handelDeleteMatchCron `);
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handelReminderCron() {
    new Logger(`Cron Sales Order`).log(`Run checkOrderForRemind `);
    const salesOrder = await this.salesOrdersRepo.find({
      where: {
        salesOrderStatus: SalesOrderStatusTypes.SP_IN_PROGRESS,
        preferredDateTime: LessThanOrEqual(moment().add(1, 'hour').toDate()),
      },
    });

    await Promise.all(
      _.map(salesOrder, async (i) => {
        if (
          i.preferredDateTime <= moment().add(1, 'hour').toDate() &&
          i.preferredDateTime >= moment().add(59, 'minute').add(30, 'second').toDate()
        ) {
          await this.customerNotificationRepo.save({
            customerId: i.customerId,
            title: 'Job reminder',
            content:
              'Reminder, Please get ready for the job. Your job is about to start in 1 hour time.',
            deeplink: `tukanggo://job-summary/${i.id}`,
          });

          await this.spNotificationRepo.save({
            serviceProviderId: i.serviceProviderId,
            title: 'Job reminder',
            content:
              'Reminder, Please get ready for the job. Your job is about to start in 1 hour time.',
            deeplink: `tukanggo://job-summary/${i.id}`,
          });
        }
      }),
    );
    new Logger(`Cron Sales Order`).log(`End checkOrderForRemind `);
  }
}
