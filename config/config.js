import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import glob from 'glob';
import chalk from 'chalk';

/* eslint-disable global-require, no-param-reassign*/
const validateEnvironmentVariable = () => {
  const environmentFiles = glob.sync(`./config/env/${process.env.NODE_ENV}.js`);
  if (!environmentFiles.length) {
    if (process.env.NODE_ENV) {
      console.error(chalk.red('+ Error: No configuration file found for "' + process.env.NODE_ENV + '" environment using development instead')); // eslint-disable-line
    } else {
      console.error(chalk.red('+ Error: NODE_ENV is not defined! Using default development environment')); // eslint-disable-line
    }
    process.env.NODE_ENV = 'development';
  }
  // Reset console color
  console.log(chalk.white('')); // eslint-disable-line
};

const validateDomainIsSet = (config) => {
  if (!config.domain) {
    console.log(chalk.red('+ Important warning: config.domain is empty. It should be set to the fully qualified domain of the app.')); // eslint-disable-line
  }
};

const validateSecureMode = (config) => {
  if (!config.secure || config.secure.ssl !== true) {
    return true;
  }

  const privateKey = fs.existsSync(path.resolve(config.secure.privateKey));
  const certificate = fs.existsSync(path.resolve(config.secure.certificate));

  if (!privateKey || !certificate) {
    console.log(chalk.red('+ Error: Certificate file or key file is missing, falling back to non-SSL mode')); // eslint-disable-line
    console.log(chalk.red('  To create them, simply run the following from your shell: sh ./scripts/generate-ssl-certs.sh')); // eslint-disable-line
    console.log();  // eslint-disable-line
    config.secure.ssl = false;
  }
  return true;
};

const initGlobalConfigFiles = (config, assets) => {
  config.files = {
    server: {}
  };

  config.files.server.routes = assets.server.routes;
};

const initGlobalConfig = () => {
  validateEnvironmentVariable();

  const assets = require('./assets/default');

  const defaultConfig = require('./env/default');

  const environmentConfig = require(`./env/${process.env.NODE_ENV}`) || {};

  const config = _.merge(defaultConfig, environmentConfig);
  const pkg = require(path.resolve('./package.json'));
  config.devfunny = pkg;

  initGlobalConfigFiles(config, assets);
  validateSecureMode(config);
  validateDomainIsSet(config);

  return config;
};
/* eslint-enable global-require, no-param-reassign */

module.exports = initGlobalConfig();
