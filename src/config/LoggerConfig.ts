import { createLogger, format, transports, Logger } from 'winston';

const logFormatter = (info: any) => {
  const { timestamp, message } = info;
  return `${timestamp} - ${message}`;
};

const logger: Logger = createLogger({
  level: process.env.LOGGER_LOGLEVEL || 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.colorize({ all: true }),
    format.printf(logFormatter)
  ),
  transports: [new transports.Console()]
});

export default logger;
