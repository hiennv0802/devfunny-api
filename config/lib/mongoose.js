import _ from 'lodash';
import config from '../config';
import chalk from 'chalk';
import path from 'path';
import mongoose from 'mongoose';

module.exports.loadModels = function(callback) {
  config.files.server.mongooseModels.forEach(function (modelPath) {
    require(path.resolve(path.join('dist', modelPath)));
  });

  if (callback) callback();
}

// Initialize Mongoose
module.exports.connect = function (callback) {
  mongoose.Promise = config.db.promise;

  var options = _.merge(config.db.options || {}, { useMongoClient: true });

  mongoose
    .connect(config.db.uri, options)
    .then(function (connection) {
      // Enabling mongoose debug mode if required
      mongoose.set('debug', config.db.debug);

      // Call callback FN
      if (callback) callback(connection.db);
    })
    .catch(function (err) {
      console.error(chalk.red('Could not connect to MongoDB!'));
      console.log(err);
    });

};

module.exports.disconnect = function (cb) {
  mongoose.connection.db
    .close(function (err) {
      console.info(chalk.yellow('Disconnected from MongoDB.'));
      return cb(err);
    });
};
