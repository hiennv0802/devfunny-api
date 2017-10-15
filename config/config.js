import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import glob from 'glob';
import chalk from 'chalk';

/* eslint-disable no-param-reassign */
const getGlobbedPaths = (globPatterns, excludes) => {
  // URL paths regex
  const urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i'); // eslint-disable-line

  // The output array
  let output = [];

  // If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
  if (_.isArray(globPatterns)) {
    globPatterns.forEach((globPattern) => {
      output = _.union(output, getGlobbedPaths(globPattern, excludes));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
      let files = glob.sync(globPatterns);
      if (excludes) {
        files = files.map((file) => {
          if (_.isArray(excludes)) {
            Object.keys(excludes).forEach((i) => {
              if (Object.prototype.hasOwnProperty.call(excludes, i)) {
                file = file.replace(excludes[i], ''); // eslint-disable-line
              }
            });
          } else {
            file = file.replace(excludes, ''); // eslint-disable-line
          }
          return file;
        });
      }
      output = _.union(output, files);
    }
  }


  return output;
};

const validateEnvironmentVariable = () => {
  const environmentFiles = glob.sync(`./config/env/${process.env.NODE_ENV}.js`);
  console.log(); // eslint-disable-line
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

const validateSessionSecret = (config, testing) => {
  if (process.env.NODE_ENV !== 'production') {
    return true;
  }

  if (config.sessionSecret === 'MEAN') {
    if (!testing) {
      console.log(chalk.red('+ WARNING: It is strongly recommended that you change sessionSecret config while running in production!')); // eslint-disable-line
      console.log(chalk.red('  Please add `sessionSecret: process.env.SESSION_SECRET || \'super amazing secret\'` to ')); // eslint-disable-line
      console.log(chalk.red('  `config/env/production.js` or `config/env/local.js`')); // eslint-disable-line
      console.log(); // eslint-disable-line
    }
    return false;
  }
  return true;
};

const initGlobalConfigFolders = (config) => {
  // Appending files
  config.folders = {
    server: {}
  };

  // Setting globbed client paths
  config.folders.client = `${process.cwd()}/public/`;
};

const initGlobalConfigFiles = (config, assets) => {
  // Appending files
  config.files = {
    server: {}
  };

  // Setting Globbed route files
  config.files.server.routes = assets.server.routes;

  // Setting Globbed config files
  config.files.server.configs = getGlobbedPaths(assets.server.config);

  // Setting Globbed policies files
  config.files.server.policies = getGlobbedPaths(assets.server.policies);
};

const initGlobalConfig = () => {
  // Validate NODE_ENV existence
  validateEnvironmentVariable();

  // Get the default assets
  const assets = require('./assets/default'); // eslint-disable-line

  // Get the default config
  const defaultConfig = require('./env/default'); // eslint-disable-line

  // Get the current config
  const environmentConfig = require('./env/' + process.env.NODE_ENV) || {}; // eslint-disable-line

  // Merge config files
  let config = _.merge(defaultConfig, environmentConfig);

  // read package.json for MEAN.JS project information
  var pkg = require(path.resolve('./package.json')); // eslint-disable-line
  config.meanjs = pkg;

  // Extend the config object with the local-NODE_ENV.js custom/local environment.
  config = _.merge(config, (fs.existsSync(path.join(process.cwd(), `config/env/local-${process.env.NODE_ENV}.js`)) && require(path.join(process.cwd(), `config/env/local-${process.env.NODE_ENV}.js`))) || {}); // eslint-disable-line

  // Initialize global globbed files
  initGlobalConfigFiles(config, assets);

  // Initialize global globbed folders
  initGlobalConfigFolders(config);

  // Validate Secure SSL mode can be used
  validateSecureMode(config);

  // Validate session secret
  validateSessionSecret(config);

  // Print a warning if config.domain is not set
  validateDomainIsSet(config);

  // Expose configuration utilities
  config.utils = {
    getGlobbedPaths: getGlobbedPaths, // eslint-disable-line
    validateSessionSecret: validateSessionSecret // eslint-disable-line
  };

  return config;
};

module.exports = initGlobalConfig();
/* eslint-enable no-param-reassign */
