import express from 'express';
import sectionCtrl from '../controllers/section.controller';
import expressJwt from 'express-jwt';
import config from '../../config/config';

const router = express.Router();

router.route('/')
  .get(sectionCtrl.list)
  .post(expressJwt({ secret: config.jwtSecret }), sectionCtrl.create);

export default router;
