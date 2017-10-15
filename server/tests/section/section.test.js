import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../../server';
import User from '../../models/user.model';

chai.config.includeStack = true;

describe('## Section APIs', () => {
  let user = {
    social_type: 'email',
    username: 'test',
    email: 'test@gmail.com',
    password: '11111111'
  };

  describe('# POST /api/sections', () => {
    beforeEach((done) => {
      User.remove({}, (err) => {
        if (err) throw err;
        done();
      });
    });

    it('should report error with message - Unauthorized', (done) => {
      request(app)
        .post('/api/sections')
        .expect(httpStatus.UNAUTHORIZED)
        .then((res) => {
          expect(res.body.message).to.equal('Unauthorized');
          done();
        })
        .catch(done);
    });

    it('should report error with message - No file was selected', (done) => {
      User.create(user, (error, userNew) => {
        request(app)
          .post('/api/auth/login')
          .send(user)
          .then((res) => {
            request(app)
              .post('/api/sections')
              .set('Authorization', 'Bearer ' + res.body.token)
              .expect(httpStatus.OK)
              .then((res) => {
                expect(res.body.success).to.equal(false);
                expect(res.body.message).to.equal('No file was selected');
                done();
              })
              .catch(done);
          })
          .catch(done);
      });
    });

    it('should upload image success and return image_id', (done) => {
      User.create(user, (error, userNew) => {
        request(app)
          .post('/api/auth/login')
          .send(user)
          .then((res) => {
            request(app)
              .post('/api/sections')
              .set('Authorization', 'Bearer ' + res.body.token)
              .field('name', 'funny')
              .attach('file', 'server/tests/upload/images/test.png')
              .expect(httpStatus.OK)
              .then((res) => {
                expect(res.body.name).to.equal('funny');
                expect(res.body).to.have.property('image');
                done();
              })
              .catch(done);
          })
          .catch(done);
      });
    });
  });
});
