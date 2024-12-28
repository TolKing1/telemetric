import { Format } from 'logform';
import { createLogger, format, transports, Logger } from 'winston';

const commonFormats: Format = format.combine(
  format(log => {
    log.level = log.level.toUpperCase();
    return log;
  })(),
  format.colorize(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message }) => `[${timestamp}] [${level}] - ${message}`)
);

const createConsoleTransport = (level: string): transports.ConsoleTransportInstance => {
  return new transports.Console({
    level,
    format: commonFormats
  });
};

const createFileTransport = (filename: string, level: string): transports.FileTransportInstance => {
  return new transports.File({
    filename,
    level,
    format: commonFormats
  });
};

const logger: Logger = createLogger({
  transports: [
    createConsoleTransport('info'),
    createConsoleTransport('debug'),
    createConsoleTransport('error'),
    createFileTransport('logs/all.log', 'info'),
    createFileTransport('logs/all.log', 'debug'),
    createFileTransport('logs/all.log', 'error')
  ]
});

export default logger;
