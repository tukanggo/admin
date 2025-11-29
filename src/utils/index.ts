import { customerMemberTierEnum } from '@modules/customers/customer.enum';
import { Response } from 'express';
import * as mime from 'mime-types';

export const memberLevel = [
  {
    level: 0,
    point: 0,
    tier: customerMemberTierEnum.BASIC,
  },
  {
    level: 1,
    point: 1000,
    tier: customerMemberTierEnum.SILVER,
  },
  {
    level: 2,
    point: 5000,
    tier: customerMemberTierEnum.GOLD,
  },
  {
    level: 3,
    point: 8000,
    tier: customerMemberTierEnum.PLATINUM,
  },
];

export const calculateMemberLevel = (totalPoint: number) => {
  let level: number;

  if (totalPoint >= 0 && totalPoint < 1000) {
    level = 0;
  } else if (totalPoint >= 1000 && totalPoint < 5000) {
    level = 1;
  } else if (totalPoint >= 5000 && totalPoint < 8000) {
    level = 2;
  } else if (totalPoint >= 8000) {
    level = 3;
  }
  return memberLevel[level];
};

export const getExtensionFromString = (val: string) => {
  const re = /(?:\.([^.]+))?$/;
  return re.exec(val)[1];
};

export const setFileResHeader = (res: Response, filename: string, ext?: string) => {
  const extension = ext || getExtensionFromString(filename);
  const contentType = mime.lookup(extension) || '';
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
};
