import express from 'express';
import { getPendingVerifications, verifyUser } from '../controllers/verification.controller.js';
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/pending', protectRoute, adminRoute, getPendingVerifications);
router.put('/:userId', protectRoute, adminRoute, verifyUser);

export default router;