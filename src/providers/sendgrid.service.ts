import * as _ from 'lodash';
import * as mailer from '@sendgrid/mail';

import * as dotenv from 'dotenv';
import logger from './logger.service';

dotenv.config();

const { SENDGRID_API_KEY, SENDGRID_SENDER_EMAIL, SENDGRID_SENDER_NAME } = process.env;
if (SENDGRID_API_KEY) mailer.setApiKey(SENDGRID_API_KEY);
type EmailData = string | { name?: string; email: string };
interface MailContent {
  type: string;
  value: string;
}
type Mail = Omit<mailer.MailDataRequired, 'from'> &
  (
    | { text: string }
    | { html: string }
    | { templateId: string }
    | { content: MailContent[] & { 0: MailContent } }
  );

const send = async (mail: Mail): Promise<void> => {
  let to: EmailData;
  let from: EmailData;
  try {
    if (!SENDGRID_SENDER_EMAIL) {
      throw new Error(
        `SendGrid sendMail: "SENDGRID_SENDER_EMAIL" environment variable is required but not specified.`,
      );
    }

    to = JSON.stringify(mail.to);
    from = { email: SENDGRID_SENDER_EMAIL, name: SENDGRID_SENDER_NAME };
    const data = { ...mail, from };
    await mailer.send(data);
    console.log(`Successfully send email from [${JSON.stringify(from)}] to [${to}] via SendGrid.`);
    logger.mail(`Successfully send email from [${JSON.stringify(from)}] to [${to}] via SendGrid.`);
    return Promise.resolve();
  } catch (e) {
    if (to) {
      const errors = _.get(e, 'response.data.errors') || [];
      console.log(
        `Failed to send mail from [${JSON.stringify(from)}] to [${to}] via SendGrid.\n${
          _.isEmpty(errors) ? e : JSON.stringify(errors)
        }`,
      );
      logger.mail(
        `Failed to send mail from [${JSON.stringify(from)}] to [${to}] via SendGrid.\n${
          _.isEmpty(errors) ? e : JSON.stringify(errors)
        }`,
      );
      console.log(errors);
    }
    return Promise.reject(e);
  }
};

export const sendgrid = { send };

export default sendgrid;
