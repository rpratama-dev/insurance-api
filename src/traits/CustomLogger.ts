import Env from '@ioc:Adonis/Core/Env';
import DailyRotateFile from 'winston-daily-rotate-file';
import * as winston from 'winston';

const rotatingLog = (level: 'info' | 'error', path?: string): DailyRotateFile => {
  return new DailyRotateFile({
    filename: `app-${level}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    dirname: path || Env.get('LOG_PATH', 'logs'),
    level: level
  });
};

// const logFormat = winston.format.printf(({ meta }) => {
//   const blocked = ['password', 'authorization', 'cookie', 'token']
//   return JSON.stringify(meta, (k, v) => {
//     if (['request_body', 'headers'].includes(k)) {
//       Object.keys(v).forEach((el) => {
//         v[el] = blocked.includes(el) ? '██████████' : v[el]
//       })
//     }
//     return v
//   })
// })

const CustomLogger = winston.createLogger({
  level: 'info',
  // format: logFormat,
  transports: [rotatingLog('info')]
});

CustomLogger.add(
  new winston.transports.File({
    level: 'error',
    filename: 'app-error.log',
    zippedArchive: Env.get('NODE_ENV') !== 'development',
    dirname: Env.get('LOG_PATH_ERROR', 'logs/error'),
    format: winston.format.json()
  })
);

// if (Env.get('NODE_ENV') === 'development') {
//   CustomLogger.add(
//     new winston.transports.Console({
//       format: winston.format.json(),
//     })
//   )
// }

export default CustomLogger;
