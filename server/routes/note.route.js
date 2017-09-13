import express from 'express';
import expressJwt from 'express-jwt';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import noteCtrl from '../controllers/note.controller';
import config from '../../config/config';

const router = express.Router();

router.route('/')
  .get(noteCtrl.list)

  .post(expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.createImageNote), noteCtrl.create);

export default router;
