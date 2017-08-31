import Joi from 'joi';

export default {
  // POST /api/users
  createUser: {
    body: {
      email: Joi.string().required().email(),
      password: Joi.string().required()
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      email: Joi.string().required().email(),
      password: Joi.string().required()
    }
  },

  // POST /api/register/signup
  signup: {
    body: {
      social_type: Joi.string().required(),
      email: Joi.string().required().email(),
      password: Joi.string().required()
    }
  }
};
