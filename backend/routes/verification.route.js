import express from 'express';
import { getPendingVerifications, verifyUser, getAllVerifications } from '../controllers/verification.controller.js';
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/pending', protectRoute, adminRoute, getPendingVerifications);
router.put('/:userId', protectRoute, adminRoute, verifyUser);
router.get('/all', protectRoute, adminRoute, getAllVerifications);

export default router;
