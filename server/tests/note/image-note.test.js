import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../../server';
import User from '../../models/user.model';

chai.config.includeStack = true;

describe('## Note APIs', () => {
  const user = {
    social_type: 'email',
    username: 'test',
    email: 'test@gmail.com',
    password: '11111111'
  };

  describe('# POST /api/notes', () => {
    beforeEach((done) => {
      User.remove({}, (err) => {
        if (err) throw err;
        done();
      });
    });

    it('should report error with message - Unauthorized', (done) => {
      request(app)
        .post('/api/notes')
        .expect(httpStatus.UNAUTHORIZED)
        .then((res) => {
          expect(res.body.message).to.equal('Unauthorized');
          done();
        })
        .catch(done);
    });

    it('should create Note success', (done) => {
      User.create(user, () => {
        request(app)
          .post('/api/auth/login')
          .send(user)
          .then((res) => {
            request(app)
              .post('/api/upload/image')
              .set('Authorization', `Bearer ${res.body.token}`)
              .attach('file', 'server/tests/section/images/test.png')
              .expect(httpStatus.OK)
              .then((resUpload) => {
                request(app)
                  .post('/api/sections')
                  .set('Authorization', `Bearer ${res.body.token}`)
                  .field('name', 'memo')
                  .attach('file', 'server/tests/upload/images/test.png')
                  .expect(httpStatus.OK)
                  .then(() => {
                    request(app)
                      .post('/api/notes')
                      .set('Authorization', `Bearer ${res.body.token}`)
                      .send({
                        title: 'demo note',
                        sectionName: 'memo',
                        imageId: resUpload.body.image_id
                      })
                      .expect(httpStatus.OK)
                      .then((resNote) => {
                        expect(resNote.body.title).to.equal('demo note');
                        expect(resNote.body).to.have.property('section');
                        done();
                      })
                    .catch(done);
                  })
                  .catch(done);
              })
              .catch(done);
          })
          .catch(done);
      });
    });
  });
});
