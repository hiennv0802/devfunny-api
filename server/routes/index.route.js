import express from 'express';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import registerRoutes from './register.route';
import uploadRoutes from './upload.route';
import sectionRoutes from './section.route';
import noteRoutes from './note.route';

const router = express.Router();

router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.use('/users', userRoutes);

router.use('/auth', authRoutes);

router.use('/register', registerRoutes);

router.use('/upload', uploadRoutes);

router.use('/sections', sectionRoutes);

router.use('/notes', noteRoutes);

export default router;
