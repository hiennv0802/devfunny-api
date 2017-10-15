import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../../server';
import User from '../../models/user.model';

chai.config.includeStack = true;

describe('## Signin with email APIs', () => {
  const user = {
    social_type: 'email',
    username: 'test',
    email: 'test@gmail.com',
    password: '11111111'
  };

  describe('# POST /api/auth/login', () => {
    beforeEach((done) => {
      User.remove({}, (err) => {
        if (err) throw err;
        done();
      });
    });

    it('should login success', (done) => {
      User.create(user, () => {
        request(app)
          .post('/api/auth/login')
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
    });

    it('should report error with message - Authentication error', (done) => {
      request(app)
        .post('/api/auth/login')
        .send(user)
        .expect(httpStatus.UNAUTHORIZED)
        .then((res) => {
          expect(res.body.message).to.equal('Authentication error');
          done();
        })
        .catch(done);
    });
  });
});
