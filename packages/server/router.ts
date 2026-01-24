import express from 'express';
import type { Request, Response } from 'express';
import { chatController } from './controllers/chat.controller';
import { prisma } from './lib/prisma';

const router = express.Router();

router.get('/', (_req: Request, res: Response) => {
  res.send('Hello World');
});

router.get('/api/hello', (_req: Request, res: Response) => {
  res.json({ message: 'endpoint hello' });
});

router.post('/api/chat', chatController.sendMessage);

router.get('/api/products/:id/reviews', async (req: Request, res: Response) => {
  const productId = Number(req.params.id);

  if (isNaN(productId)) {
    res.status(400).json({ message: 'Invalid product ID.' });
    return;
  }

  const reviews = await prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: 'desc' },
  });

  res.json(reviews);
});

export default router;
