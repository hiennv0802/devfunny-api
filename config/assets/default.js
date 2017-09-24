module.exports = {
  server: {
    gulpConfig: ['gulpfile.babel.js'],
    allJS: ['server.js', 'config/**/*.js', 'server/**/*.js'],
    mongooseModels: 'server/models/**/*.js',
    routes: ['server/routes/**/*.js'],
    tests: ['dist/server/tests/**/*test.js']
  }
};

