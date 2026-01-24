import type { Request, Response } from 'express';
import { reviewService } from '../services/review.service';

export const reviewController = {
  async getReviews(req: Request, res: Response) {
    const productId = Number(req.params.id);

    if (isNaN(productId)) {
      res.status(400).json({ message: 'Invalid product ID.' });
      return;
    }

    try {
      const reviews = await reviewService.getReviews(productId);

      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get reviews.' });
    }
  },
};
