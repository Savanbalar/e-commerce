// const {createLogger,format,transports, level} = require('winston');

// const logger = createLogger({
//     level:'info',
//     format: format.combine(
//         format.timestamp({format:'YYYY-MM-DD HH-mm-ss'}),
//         format.printf((timestamp,level,message) =>{
//             return `${timestamp} [${level}]: ${message}`
//         })
//     ),
//     transports :[  
//         new transports.Console(),
//         new transports.File({filename : 'app.log'})
//     ]
// })

// module.exports = logger;

const {createLogger,format,transports} = require('winston');
const config = require('../config/config');

const enumerateErrorFormat = format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logger = createLogger({
  // level: config.env === 'development' ? 'debug' : 'info',
  format: format.combine(
    enumerateErrorFormat(),  
    config.env === 'development' ? format.colorize() : format.uncolorize(),
    format.splat(),
    format.printf(({level,message }) => `${level}: ${message}`)
  ),
  transports: [
    new transports.Console({
      stderrLevels: ['error'],
    }),
  ],
});

module.exports = logger;