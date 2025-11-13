import pino from 'pino';

export const logger = pino({
  name: 'insightplus',
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === "development" 
    ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        singleLine: true,
        ignore: 'pid,hostname',
        messageFormat: '[{level}] {msg}',
        levelFirst: true,
      },
    }
    : undefined,
});
