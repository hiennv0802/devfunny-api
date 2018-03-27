import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
import User from '../models/user.model';

function login(req, res, next) {
  User.findOne(
    {
      email: req.body.email
    },
    (errors, user) => {
      if (errors) throw errors;

      if (!user) {
        const err = new APIError(
          'Authentication error',
          httpStatus.UNAUTHORIZED,
          true
        );
        return next(err);
      }

      return user.comparePassword(req.body.password, (err, isMatch) => {
        if (err) throw err;

        if (isMatch) {
          const token = jwt.sign(
            {
              _id: user._id,
              email: user.email,
              username: user.username
            },
            config.jwtSecret
          );

          return res.json({
            token: token, // eslint-disable-line
            username: user.username,
            email: user.email,
            social_type: user.social_type,
            social_id: user.social_id
          });
        }
        const errAuth = new APIError(
          'Authentication error',
          httpStatus.UNAUTHORIZED,
          true
        );
        return next(errAuth);
      });
    }
  );
}

export default { login };
