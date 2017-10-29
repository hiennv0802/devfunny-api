module.exports = {
  app: {
    title: 'Devfunny',
    description: 'Making things better',
    keywords: 'devfunny, funny, better',
    googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
  },
  db: {
    promise: global.Promise
  },
  port: process.env.PORT || 4040,
  host: process.env.HOST || '0.0.0.0',
  domain: process.env.DOMAIN,
  jwtSecret: process.env.JWT_SECRET || 'jwtSecret'
};
