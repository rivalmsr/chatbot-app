import express from 'express';
import type { Request, Response } from 'express';
import { chatController } from './controllers/chat.controller';
import { reviewController } from './controllers/review.controller';

const router = express.Router();

router.get('/', (_req: Request, res: Response) => {
  res.send('Hello World');
});

router.get('/api/hello', (_req: Request, res: Response) => {
  res.json({ message: 'endpoint hello' });
});

router.post('/api/chat', chatController.sendMessage);

router.get('/api/products/:id/reviews', reviewController.getReviews);

export default router;
