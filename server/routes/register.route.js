import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import registerCtrl from '../controllers/register.controller';
import config from '../../config/config';

const router = express.Router();

router.route('/')
  .post(validate(paramValidation.signup), registerCtrl.signup);

export default router;
