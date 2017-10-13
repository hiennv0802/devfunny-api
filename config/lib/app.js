import 'babel-polyfill'
import config from '../config';
import mongooseService from './mongoose';
import express from './express';
import chalk from 'chalk';
import seed from './seed';

function seedDB() {
  if (config.seedDB && config.seedDB.seed) {
    console.log(chalk.bold.red('Warning:  Database seeding is turned on'));
    seed.start();
  }
}

mongooseService.connect(function (db) {
  mongooseService.loadModels(seedDB);
});

var app = express.init();

app.listen(config.port, config.host, function () {
  var server = (process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + config.host + ':' + config.port;
  console.log('--');
  console.log(chalk.green(config.app.title));
  console.log();
  console.log(chalk.green('Environment:     ' + process.env.NODE_ENV));
  console.log(chalk.green('Server:          ' + server));
  console.log(chalk.green('Database:        ' + config.db.uri));
  console.log(chalk.green('App version:     ' + config.meanjs.version));
  if (config.meanjs['meanjs-version'])
    console.log(chalk.green('MEAN.JS version: ' + config.meanjs['meanjs-version']));
  console.log('--');

});

export default app;
