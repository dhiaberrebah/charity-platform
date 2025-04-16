import express from 'express';
import { chatWithAI } from '../controllers/ai.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Add a test route that doesn't require OpenAI
router.get('/test', (req, res) => {
  res.json({ 
    message: 'AI routes working',
    apiKeySet: !!process.env.OPENAI_API_KEY
  });
});

// Simple test chat route without OpenAI
router.post('/test-chat', (req, res) => {
  const { message } = req.body;
  res.json({ message: `Echo: ${message}` });
});

router.post('/chat', protectRoute, chatWithAI);

export default router;
