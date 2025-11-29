import { registerEnumType } from '@nestjs/graphql';

export enum SalesOrderStatusTypes {
  MATCHING = 'MATCHING',
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  READY_TO_REDEEM = 'READY_TO_REDEEM',
  PENDING_SERVICE = 'PENDING_SERVICE',
  SP_IN_PROGRESS = 'SP_IN_PROGRESS',
  IN_PROGRESS = 'IN_PROGRESS',
  SP_COMPLETE = 'SP_COMPLETE',
  COMPLETE = 'COMPLETE',
  CANCELLED = 'CANCELLED',
}

export enum filerStatusEnum {
  MATCHING = 'MATCHING',
  ACTIVE = 'ACTIVE',
  COMPLETE = 'COMPLETE',
}

export enum PaymentStatusTypes {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PROCESSING_PAYMENT = 'PROCESSING_PAYMENT',
  PAID = 'PAID',
  FAIL_PAYMENT = 'FAIL_PAYMENT',
}

registerEnumType(SalesOrderStatusTypes, { name: 'SalesOrderStatusTypes' });
registerEnumType(PaymentStatusTypes, { name: 'PaymentStatusTypes' });
registerEnumType(filerStatusEnum, { name: 'filerStatusEnum' });
