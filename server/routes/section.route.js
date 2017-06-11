import express from 'express';
import sectionCtrl from '../controllers/section.controller';

const router = express.Router();

router.route('/')
  .get(sectionCtrl.list)
  .post(sectionCtrl.create);

export default router;
