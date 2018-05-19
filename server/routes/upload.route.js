import express from 'express';
import expressJwt from 'express-jwt';
import config from '../../config/config';
import uploadCtrl from '../controllers/upload.controller';

const router = express.Router(); // eslint-disable-line

router.route('/image')
  .post(expressJwt({ secret: config.jwtSecret }), uploadCtrl.uploadImage);

export default router;
