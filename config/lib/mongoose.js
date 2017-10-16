import _ from 'lodash';
import chalk from 'chalk';
import mongoose from 'mongoose';
import config from '../config';

// Initialize Mongoose
module.exports.connect = (callback) => {
  mongoose.Promise = config.db.promise;

  const options = _.merge(config.db.options || {}, { useMongoClient: true });

  mongoose
    .connect(config.db.uri, options)
    .then((connection) => {
      mongoose.set('debug', config.db.debug);
      if (callback) callback(connection.db);
    })
    .catch((err) => {
      console.error(chalk.red('Could not connect to MongoDB!'));
      console.log(err);
    });
};

module.exports.disconnect = (cb) => {
  mongoose.connection.db
    .close((err) => {
      console.info(chalk.yellow('Disconnected from MongoDB.'));
      return cb(err);
    });
};
