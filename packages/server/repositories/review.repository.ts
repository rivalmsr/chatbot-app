import type { Review, Summary } from '../generated/prisma/client';
import { prisma } from '../lib/prisma';
import dayjs from 'dayjs';

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

  storeReviewSummary(productId: number, summary: string): Promise<Summary> {
    const generatedAt = new Date();
    const expiresAt = dayjs().add(7, 'days').toDate();

    const data = { content: summary, generatedAt, expiresAt, productId };

    return prisma.summary.upsert({
      where: { productId },
      create: data,
      update: data,
    });
  },

  async getReviewSummary(productId: number): Promise<Summary | null> {
    return await prisma.summary.findUnique({
      where: { productId },
    });
  },
};
