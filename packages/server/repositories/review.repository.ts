import type { Review } from '../generated/prisma/client';
import { prisma } from '../lib/prisma';

type QueryOptions = {
  limit?: number;
};

export const reviewRepository = {
  async getReviews(
    productId: number,
    queryOptions?: QueryOptions
  ): Promise<Review[]> {
    return await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      take: queryOptions?.limit,
    });
  },
};
