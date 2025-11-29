import { registerEnumType } from '@nestjs/graphql';

export enum DisbursementStatusEnum {
  PENDING = 'PENDING',
  DISBURSED = 'DISBURSED',
}

registerEnumType(DisbursementStatusEnum, {
  name: 'DisbursementStatusEnum',
});
