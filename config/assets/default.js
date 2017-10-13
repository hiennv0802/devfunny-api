module.exports = {
  server: {
    gulpConfig: ['gulpfile.babel.js'],
    allJS: ['server.js', 'config/**/*.js', 'server/**/*.js'],
    routes: ['../../server/routes/index.route.js'],
    tests: ['server/tests/**/*test.js']
  }
};

