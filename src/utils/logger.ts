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

const createConsoleTransport = (): transports.ConsoleTransportInstance => {
  return new transports.Console({
    format: commonFormats
  });
};

const createFileTransport = (filename: string): transports.FileTransportInstance => {
  return new transports.File({
    filename,
    format: commonFormats
  });
};

const logger: Logger = createLogger({
  level: 'debug',
  transports: [
    createConsoleTransport(),
    createFileTransport('logs/all.log')
  ]
});

export default logger;