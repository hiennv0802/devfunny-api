import {Strategy as JwtStrategy} from 'passport-jwt';
import {ExtractJwt as ExtractJwt} from 'passport-jwt';

import User from '../server/models/user.model';
import config from './config';

module.exports = function(passport) {
  var opts = {};
  opts.secretOrKey = config.jwtSecret;
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();

  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.id}, function(err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  }));
};
