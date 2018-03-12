import chalk from 'chalk';
import config from '../config';
import mongoose from './mongoose';
import express from './express';

const app = express.init();
mongoose.connect();

app.listen(config.port, config.host, () => {
  const server = `${(process.env.NODE_ENV === 'secure' ? 'https://' : 'http://')}${config.host}:${config.port}`;
  console.log('--');
  console.log(chalk.green(config.app.title));
  console.log();
  console.log(chalk.green(`Environment:        ${process.env.NODE_ENV}`));
  console.log(chalk.green(`Server:             ${server}`));
  console.log(chalk.green(`Database:           database-${process.env.NODE_ENV}`));
  console.log(chalk.green(`App version:        ${config.devfunny.version}`));
  if (config.devfunny['devfunny-api-version']) {
    console.log(chalk.green(`Devfunny version:   ${config.devfunny['devfunny-api-version']}`));
  }
  console.log('--');
});

export default app;
