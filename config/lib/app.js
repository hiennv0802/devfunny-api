import 'babel-polyfill';
import chalk from 'chalk';
import config from '../config';
import mongooseService from './mongoose';
import express from './express';

mongooseService.connect(() => {

});

const app = express.init();

app.listen(config.port, config.host, () => {
  /* eslint-disable no-console */
  const server = `${(process.env.NODE_ENV === 'secure' ? 'https://' : 'http://')}${config.host}:${config.port}`;
  console.log('--');
  console.log(chalk.green(config.app.title));
  console.log();
  console.log(chalk.green(`Environment:        ${process.env.NODE_ENV}`));
  console.log(chalk.green(`Server:             ${server}`));
  console.log(chalk.green(`Database:           ${config.db.uri}`));
  console.log(chalk.green(`App version:        ${config.meanjs.version}`));
  if (config.meanjs['meanjs-version']) {
    console.log(chalk.green(`Devfunny version:   ${config.meanjs['meanjs-version']}`));
  }
  console.log('--');
  /* eslint-enable no-console */
});

export default app;
