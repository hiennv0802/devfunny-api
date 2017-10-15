import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import User from '../models/user.model';

function signup(req, res, next) {
  const username = req.body.email.split('@')[0];
  const user = new User({
    social_type: 'email',
    username: username, // eslint-disable-line
    email: req.body.email,
    password: req.body.password
  });

  user.save((err) => {
    if (err) {
      const e = new APIError('Email address already exists', httpStatus.CONFLICT, true);
      return next(e);
    }
    return res.json(user);
  });
}

export default { signup };
