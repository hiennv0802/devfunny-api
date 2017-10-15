import express from 'express';
import expressJwt from 'express-jwt';
import sectionCtrl from '../controllers/section.controller';
import config from '../../config/config';

const router = express.Router(); // eslint-disable-line

router.route('/')
  .get(sectionCtrl.list)
  .post(expressJwt({ secret: config.jwtSecret }), sectionCtrl.create);

export default router;
