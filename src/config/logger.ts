import pino from 'pino';
import config from './config';

const logger = pino({
  level: config.logLevel,
  base: { env: config.env },
  ...(config.isDev && {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: true,
        colorize: true,
        messageFormat: '{msg} - {reqId}',
      },
    },
  }),
});

export default logger;
export type Logger = typeof logger;
  