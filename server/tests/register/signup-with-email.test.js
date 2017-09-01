import mongoose from 'mongoose';
import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../../index';
import User from '../../models/user.model';

chai.config.includeStack = true;

after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  done();
});

describe('## Signup with email APIs', () => {
  let user = {
    social_type: 'email',
    username: 'hienbx94',
    email: 'hienbx94@gmail.com',
    password: '11111111'
  };

  describe('# POST /api/register', () => {
    beforeEach(function(done) {
      User.remove({}, function (err) {
        if (err) throw err;
        done();
      });
    });

    it('should create a new user', (done) => {
      request(app)
        .post('/api/register')
        .send(user)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.social_type).to.equal(user.social_type);
          expect(res.body.username).to.equal(user.username);
          expect(res.body.email).to.equal(user.email);
          done();
        })
        .catch(done);
    });

    it('should report error with message - Email address already exists, when user existed', (done) => {
      User.create(user);
      request(app)
        .post('/api/register')
        .send(user)
        .expect(httpStatus.CONFLICT)
        .then((res) => {
          expect(res.body.message).to.equal('Email address already exists');
          done();
        })
        .catch(done);
    });
  });
});
