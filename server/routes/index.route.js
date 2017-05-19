import express from 'express';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import uploadRoutes from './upload.route';

const router = express.Router();

router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount user routes at /users
router.use('/users', userRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

// mount user routes at /users
router.use('/upload', uploadRoutes);

export default router;
