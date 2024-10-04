import winston from 'winston';
//import path from 'path';

// Custom format for logs
const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp}-${level}: ${message}`;
});

// Create a Winston logger
const logger = winston.createLogger({
  level: 'debug', // Set the minimum log level to debug
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), 
    // Add timestamp
    winston.format.colorize(),
    winston.format.simple(),
    // winston.format((info) => {
    //   info.filename = path.basename(module.parent?.filename || 'unknown'); // Add filename
    //   return info;
    // })(),
    customFormat
  ),
  transports: [
    new winston.transports.Console(), // Log to console
    new winston.transports.File({ filename: 'combined.log' }) // Log to file
  ],
});

export default logger;
