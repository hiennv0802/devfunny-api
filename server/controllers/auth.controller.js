import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
import User from '../models/user.model';

/**
 * Returns jwt token if valid email and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  User.findOne({
    email: req.body.email
  }, (errors, user) => {
    if (errors) throw errors;

    if (!user) {
      const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
      return next(err);
    }

    return user.comparePassword(req.body.password, (err, isMatch) => {
      if (err) throw err;

      if (isMatch) {
        const token = jwt.sign({
          _id: user._id,
          email: user.email,
          username: user.username
        }, config.jwtSecret);

        return res.json({
          token: token, // eslint-disable-line
          username: user.username,
          email: user.email,
          social_type: user.social_type,
          social_id: user.social_id
        });
      }
      const errAuth = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
      return next(errAuth);
    });
  });
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}

export default { login, getRandomNumber };
