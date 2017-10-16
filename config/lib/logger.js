import _ from 'lodash';
import chalk from 'chalk';
import fs from 'fs';
import winston from 'winston';
import config from '../config';

const validFormats = ['combined', 'common', 'dev', 'short', 'tiny'];

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: 'info',
      colorize: true,
      showLevel: true,
      handleExceptions: true,
      humanReadableUnhandledException: true
    })
  ],
  exitOnError: false
});

logger.stream = {
  write(msg) {
    logger.info(msg);
  }
};

logger.setupFileLogger = function setupFileLogger() {
  const fileLoggerTransport = this.getLogOptions();
  if (!fileLoggerTransport) {
    return false;
  }

  try {
    if (fs.openSync(fileLoggerTransport.filename, 'a+')) {
      logger.add(winston.transports.File, fileLoggerTransport);
    }

    return true;
  } catch (err) {
    if (process.env.NODE_ENV !== 'test') {
      console.log();
      console.log(chalk.red('An error has occured during the creation of the File transport logger.'));
      console.log(chalk.red(err));
      console.log();
    }

    return false;
  }
};

logger.getLogOptions = function getLogOptions() {
  const _config = _.clone(config, true);
  const configFileLogger = _config.log.fileLogger;

  if (!_.has(_config, 'log.fileLogger.directoryPath') || !_.has(_config, 'log.fileLogger.fileName')) {
    console.log('unable to find logging file configuration');
    return false;
  }

  const logPath = `${configFileLogger.directoryPath}/${configFileLogger.fileName}`;

  return {
    level: 'debug',
    colorize: false,
    filename: logPath,
    timestamp: true,
    maxsize: configFileLogger.maxsize ? configFileLogger.maxsize : 10485760,
    maxFiles: configFileLogger.maxFiles ? configFileLogger.maxFiles : 2,
    json: (_.has(configFileLogger, 'json')) ? configFileLogger.json : false,
    eol: '\n',
    tailable: true,
    showLevel: true,
    handleExceptions: true,
    humanReadableUnhandledException: true
  };
};

logger.getMorganOptions = function getMorganOptions() {
  return {
    stream: logger.stream
  };
};

logger.getLogFormat = function getLogFormat() {
  let format = config.log && config.log.format ? config.log.format.toString() : 'combined';

  // make sure we have a valid format
  if (!_.includes(validFormats, format)) {
    format = 'combined';

    if (process.env.NODE_ENV !== 'test') {
      console.log();
      console.log(chalk.yellow(`Warning: An invalid format was provided. The logger will use the default format of "${format}"`));
      console.log();
    }
  }

  return format;
};

logger.setupFileLogger();

module.exports = logger;
