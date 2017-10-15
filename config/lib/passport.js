import { Strategy, ExtractJwt } from 'passport-jwt';

import User from '../../server/models/user.model';
import config from '../config';

module.exports = (passport) => {
  const opts = {};
  opts.secretOrKey = config.jwtSecret;
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();

  passport.use(new Strategy(opts, (jwtPayload, done) => {
    User.findOne({ id: jwtPayload.id }, (err, user) => {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    });
  }));
};
