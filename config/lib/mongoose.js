import _ from 'lodash';
import chalk from 'chalk';
import path from 'path';
import mongoose from 'mongoose';
import config from '../config';

module.exports.loadModels = (callback) => {
  config.files.server.mongooseModels.forEach((modelPath) => {
    require(path.resolve(path.join('dist', modelPath))); // eslint-disable-line
  });

  if (callback) callback();
};

// Initialize Mongoose
module.exports.connect = (callback) => {
  mongoose.Promise = config.db.promise;

  const options = _.merge(config.db.options || {}, { useMongoClient: true });

  mongoose
    .connect(config.db.uri, options)
    .then((connection) => {
      // Enabling mongoose debug mode if required
      mongoose.set('debug', config.db.debug);

      // Call callback FN
      if (callback) callback(connection.db);
    })
    .catch((err) => {
      console.error(chalk.red('Could not connect to MongoDB!')); // eslint-disable-line
      console.log(err); // eslint-disable-line
    });
};

module.exports.disconnect = (cb) => {
  mongoose.connection.db
    .close((err) => {
      console.info(chalk.yellow('Disconnected from MongoDB.')); // eslint-disable-line
      return cb(err);
    });
};
