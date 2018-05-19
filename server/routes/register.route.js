import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/lib/param-validation';
import registerCtrl from '../controllers/register.controller';

const router = express.Router(); // eslint-disable-line

router.route('/')
  .post(validate(paramValidation.signup), registerCtrl.signup);

export default router;
