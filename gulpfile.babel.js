import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import path from 'path';
import del from 'del';
import runSequence from 'run-sequence';
import semver from 'semver';

require('dotenv').load();

var defaultAssets = require('./config/assets/default');

const plugins = gulpLoadPlugins();

gulp.task('env:test', function () {
  process.env.NODE_ENV = 'test';
});

const paths = {
  js: ['./**/*.js', '!dist/**', '!client/**', '!node_modules/**', '!coverage/**'],
  nonJs: ['./package.json', './.gitignore', './.env'],
  tests: './server/tests/*.js'
};

// Clean up dist and coverage directory
gulp.task('clean', () =>
  del.sync(['dist/**', 'dist/.*', 'coverage/**', '!dist', '!coverage'])
);

// Copy non-js files to dist
gulp.task('copy', () =>
  gulp.src(paths.nonJs)
    .pipe(plugins.newer('dist'))
    .pipe(gulp.dest('dist'))
);

// Compile ES6 to ES5 and copy to dist
gulp.task('babel', () =>
  gulp.src([...paths.js, '!gulpfile.babel.js'], { base: '.' })
    .pipe(plugins.newer('dist'))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.babel())
    .pipe(plugins.sourcemaps.write('.', {
      includeContent: false,
      sourceRoot(file) {
        return path.relative(file.path, __dirname);
      }
    }))
    .pipe(gulp.dest('dist'))
);

// Start server with restart on file changes
gulp.task('nodemon', ['copy', 'babel'], () => {
  var debugArgument = semver.satisfies(process.versions.node, '>=7.0.0') ? '--inspect' : '--debug';

  return plugins.nodemon({
    script: path.join('dist', 'server.js'),
    nodeArgs: [debugArgument],
    ext: 'js',
    verbose: true,
    ignore: ['node_modules/**/*.js', 'dist/**/*.js', 'doc/**'],
    tasks: ['copy', 'babel']
  })
});

// gulp serve for development
gulp.task('serve', ['clean'], () => runSequence('nodemon'));

// default task: clean dist, compile js files and copy non-js files.
gulp.task('default', ['clean'], () => {
  runSequence(
    ['copy', 'babel']
  );
});

// Drops the MongoDB database, used in e2e testing
gulp.task('dropdb', function (done) {
  // Use mongoose configuration
  var mongooseService = require('./config/lib/mongoose');

  mongooseService.connect(function (db) {
    db.dropDatabase(function (err) {
      if (err) {
        console.error(err);
      } else {
        console.log('Successfully dropped db: ', db.databaseName);
      }

      mongooseService.disconnect(done);
    });
  });
});

// Mocha tests task
gulp.task('mocha', function (done) {
  var mongooseService = require('./config/lib/mongoose');
  var testSuites = defaultAssets.server.tests;
  var error;

  var mongoose = require('mongoose');

  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();

  // Connect mongoose
  mongooseService.connect(function (db) {
    // Load mongoose models
    mongooseService.loadModels();

    gulp.src(testSuites)
      .pipe(plugins.mocha({
        ui: 'bdd',
        reporter: 'spec',
        timeout: 10000,
        compilers: 'js:babel-core/register'
      }))
      .on('error', function (err) {
        // If an error occurs, save it
        error = err;
        console.log(error);
      })
      .on('end', function () {
        mongooseService.disconnect(function (err) {
          if (err) {
            console.log('Error disconnecting from database');
            console.log(err);
          }

          return done(error);
        });
      });
  });
});

gulp.task('test:server', ['clean'], function (done) {
  runSequence('env:test', 'dropdb', ['copy', 'babel'], 'mocha', done);
});
