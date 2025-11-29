import 'winston-daily-rotate-file';

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

interface CustomLevels extends winston.Logger {
  mail: winston.LeveledLogMethod;
}

const { format } = winston;
const custom = {
  levels: {
    mail: -1,
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
    http: 5,
  },
  colors: {
    error: 'red',
    warn: 'orange',
    info: 'white bold yellow',
    verbose: 'blue',
    debug: 'green',
    http: 'pink',
    mail: 'cyan',
  },
};
const { NODE_ENV } = process.env;

winston.addColors(custom.colors);
// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
export const myFormat = format.printf(
  (info) => `[${info.timestamp}] [${info.level}] ${info.message}`,
);

const configs = {
  console: {
    handleExceptions: true,
    level: NODE_ENV === 'development' ? 'debug' : 'error',
    format: format.combine(
      format.timestamp(),
      format.colorize({ colors: custom.colors }),
      format.json(),
      myFormat,
    ),
  },
  verbose: {
    format: format.combine(format.timestamp(), format.json(), myFormat),
  },
  daily: {
    maxSize: '20m',
  },
};

const transport = {
  debug: new DailyRotateFile({
    ...configs.verbose,
    ...configs.daily,
    dirname: './logs/info/',
    filename: '%DATE%.log',
    level: 'debug',
  }),
  error: new DailyRotateFile({
    ...configs.verbose,
    ...configs.daily,
    dirname: './logs/error/',
    filename: '%DATE%.log',
    level: 'error',
  }),
  mail: new DailyRotateFile({
    ...configs.verbose,
    ...configs.daily,
    dirname: './logs/mail/',
    filename: '%DATE%.log',
    level: 'mail',
  }),
};

export const logger: CustomLevels = <CustomLevels>winston.createLogger({
  levels: custom.levels,
  level: NODE_ENV === 'development' ? 'debug' : 'error',
  transports: [
    transport.debug,
    transport.error,
    transport.mail,
    new winston.transports.Console(configs.console),
  ],
});

export default logger;
