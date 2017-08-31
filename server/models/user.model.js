import Promise from 'bluebird';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

const social_types = ['email', 'facebook', 'twitter'];

const UserSchema = new mongoose.Schema({
  displayName: {
    type: String
  },
  social_id: {
    type: String,
    default: null
  },
  social_type: {
    type: String,
    enum: social_types,
    required: true
  },
  username:{
    type: String,
    index: { unique: true }
  },
  email: {
    type: String,
    default: null
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

UserSchema.index(
  {
    email: 1,
    social_id: 1,
    social_type: 1
  },
  { unique: true }
)

UserSchema.pre('save', function (next) {
  var user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

UserSchema.methods.comparePassword = function (passw, cb) {
  bcrypt.compare(passw, this.password, function (err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

UserSchema.statics = {
  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

export default mongoose.model('User', UserSchema);
