import { logDir } from '../constants/app.constant';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

// Define log level based on environment
const level = (): string => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Define log format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize(),
  winston.format.printf(
    (info) => `${info.timestamp} [${info.level}]: ${info.message}`,
  ),
);

// Create logger instance
const logger = winston.createLogger({
  level: level(),
  format,
  transports: [
    new winston.transports.DailyRotateFile({
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir,
      filename: 'server-%DATE%.log',
      zippedArchive: true,
      handleExceptions: true,
      maxFiles: '30d',
    }),
    new winston.transports.DailyRotateFile({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir,
      filename: 'error-%DATE%.log',
      zippedArchive: true,
      maxFiles: '30d',
    }),
    new winston.transports.Console({
      handleExceptions: true,
    }),
  ],
});

export default logger;
