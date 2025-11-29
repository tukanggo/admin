/* eslint-disable max-len */
import { createHash } from 'node:crypto';
const querystring = require('querystring');

export const generateSecureHash = (
  amount: number,
  transactionId: number | string,
  detail: string,
) => {
  const securityString = `${process.env.SENANGPAY_SECRET_KEY}${detail}${Number(amount).toFixed(
    2,
  )}${transactionId}`;
  return createHash('md5').update(securityString).digest('hex');
};

export interface VerifyHashParams {
  name: string;
  email: string;
  phone: string;
  amount: string;
  txn_status: string;
  order_id: string;
  txn_ref: string;
  msg: string;
  hash?: string;
  txn_type: string;
}

const encodeUrl = (str: string) => encodeURIComponent(str).replace(new RegExp('%20', 'g'), '+');
export const generateVerifyHash = (params: VerifyHashParams) => {
  let { name, email, phone, amount, txn_status, order_id, txn_ref, msg, txn_type } = params;
  name = encodeUrl(name);
  email = encodeUrl(email);
  phone = encodeUrl(phone);
  amount = encodeUrl(amount);
  txn_status = encodeUrl(txn_status);
  order_id = encodeUrl(order_id);
  txn_ref = encodeUrl(txn_ref);
  msg = encodeUrl(msg);
  txn_type = encodeUrl(txn_type);
  const secureStr = `${process.env.SENANGPAY_SECRET_KEY}?name=${name}&email=${email}&phone=${phone}&amount=${amount}&status=${txn_status}&refNo=${order_id}&txn_ref=${txn_ref}&msg=${msg}&hash=[HASH]&txn_type=${txn_type}`;
  return createHash('md5').update(secureStr).digest('hex');
};

interface PaymentLink {
  detail: string;
  transactionId: string | number;
  amount: number;
  name: string;
  email: string;
  phoneNo: string;
}
export const generatePaymentLink = ({
  transactionId,
  amount,
  name,
  email,
  phoneNo,
  detail,
}: PaymentLink): string => {
  const query = {
    detail,
    amount: Number(amount).toFixed(2),
    order_id: transactionId,
    hash: generateSecureHash(amount, transactionId, detail),
    name: name,
    email: email,
    phone: phoneNo,
  };
  return `${process.env.SENANGPAY_PAYMENT_LINK}?${querystring.encode(query)}`;
};
