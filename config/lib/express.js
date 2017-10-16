import express from 'express';
import morgan from 'morgan';
import expressWinston from 'express-winston';
import bodyParser from 'body-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import path from 'path';
import _ from 'lodash';
import passport from 'passport';
import httpStatus from 'http-status';
import expressValidation from 'express-validation';
import cors from 'cors';
import config from '../config';
import winstonInstance from './winston';
import logger from './logger';
import APIError from './APIError';

require('./passport')(passport);

/* eslint-disable global-require, no-param-reassign*/
const app = express();

const initLocalVariables = () => {
  app.locals.title = config.app.title;
  app.locals.description = config.app.description;
  if (config.secure && config.secure.ssl === true) {
    app.locals.secure = config.secure.ssl;
  }
  app.locals.keywords = config.app.keywords;
  app.locals.googleAnalyticsTrackingID = config.app.googleAnalyticsTrackingID;
  app.locals.facebookAppId = config.facebook.clientID;
  app.locals.twitterUsername = config.twitter.username;
  app.locals.env = process.env.NODE_ENV;
  app.locals.domain = config.domain;

  app.use((req, res, next) => {
    res.locals.host = `${req.protocol}://${req.hostname}`;
    res.locals.url = `${req.protocol}://${req.headers.host}${req.originalUrl}`;
    next();
  });
};

const initMiddleware = () => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(cookieParser());
  app.use(compress());
  app.use(methodOverride());
  app.use(cors());

  if (_.has(config, 'log.format')) {
    app.use(morgan(logger.getLogFormat(), logger.getMorganOptions()));
  }

  if (process.env.NODE_ENV === 'development') {
    expressWinston.requestWhitelist.push('body');
    expressWinston.responseWhitelist.push('body');
    app.use(expressWinston.logger({
      winstonInstance,
      meta: true,
      msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
      colorStatus: true
    }));
  }

  if (process.env.NODE_ENV !== 'test') {
    app.use(expressWinston.errorLogger({
      winstonInstance
    }));
  }
};

const initHelmetHeaders = () => {
  const SIX_MONTHS = 15778476000;
  app.use(helmet.frameguard());
  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());
  app.use(helmet.hsts({
    maxAge: SIX_MONTHS,
    includeSubdomains: true,
    force: true
  }));
  app.disable('x-powered-by');
};

const initModulesServerRoutes = () => {
  config.files.server.routes.forEach((routePath) => {
    app.use('/api', require(path.resolve(__dirname, routePath)));
  });
};

const initErrorRoutes = () => {
  app.use((err, req, res, next) => {
    if (err instanceof expressValidation.ValidationError) {
      const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
      const error = new APIError(unifiedErrorMessage, err.status, true);
      return next(error);
    } else if (!(err instanceof APIError)) {
      const apiError = new APIError(err.message, err.status, err.isPublic);
      return next(apiError);
    }
    return next(err);
  });

  app.use((req, res, next) => {
    const err = new APIError('API not found', httpStatus.NOT_FOUND);
    return next(err);
  });

  app.use((err, req, res, next) => // eslint-disable-line
    res.status(err.status).json({
      message: err.isPublic ? err.message : httpStatus[err.status],
      stack: process.env.NODE_ENV === 'development' ? err.stack : {}
    })
  );
};

module.exports.init = () => {
  initLocalVariables();
  initMiddleware();
  initHelmetHeaders();
  initModulesServerRoutes();
  initErrorRoutes();
  return app;
};
/* eslint-enable global-require, no-param-reassign */
