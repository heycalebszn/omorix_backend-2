import { createLogger, format as _format, transports as _transports } from 'winston';

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: _format.combine(
    _format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    _format.errors({ stack: true }),
    _format.splat(),
    _format.json(),
  ),
  defaultMeta: { service: 'Omorix-api' },
  transports: [
    new _transports.Console({
      format: _format.combine(
        _format.colorize(),
        _format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
      ),
    }),
    new _transports.File({ filename: 'logs/error.log', level: 'error' }),
    new _transports.File({ filename: 'logs/combined.log' }),
  ],
});

export default logger;
