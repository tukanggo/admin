import axios from 'axios';
import { logger } from './logger.service';

interface SendSMS {
  to: string;
  message: string;
}
/**
 *
 * @param to: (string) phone number
 * @param message: (string)　sms message
 * @returns Promise <void>
 */
export const sendSMS = async ({ to, message }: SendSMS): Promise<void> => {
  if (process.env.SMS_SERVICE === 'false') return Promise.resolve();
  let errorCode: number;
  try {
    logger.info(`OnewaySMS: Send sms to ${to}. Message: "${message}"`);
    const res = await axios.get(process.env.ONEWAYSMS_API_URL, {
      params: {
        apiusername: process.env.ONEWAYSMS_USERNAME,
        apipassword: process.env.ONEWAYSMS_PASSWORD,
        mobileno: to.replace('+', ''),
        senderid: 'onewaysms',
        languagetype: 1,
        message,
      },
    });
    errorCode = res.data;
    switch (res.data) {
      case -100:
        throw new Error('apipassname or apipassword is invalid');
      case -200:
        throw new Error('senderid parameter is invalid');
      case -300:
        throw new Error('mobileno parameter is invalid');
      case -400:
        throw new Error('languagetype is invalid');
      case -500:
        throw new Error('Invalid characters in message');
      case -600:
        throw new Error('Insufficient credit balance');
      default:
        break;
    }

    return Promise.resolve();
  } catch (e) {
    logger.error(
      `OnewaySMS Error: Failed to send sms to ${to}. Status code: ${errorCode}: ${e.message}`,
    );
    return Promise.reject(e);
  }
};
