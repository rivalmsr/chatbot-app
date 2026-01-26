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

  async storeReviewSummary(
    productId: number,
    summary: string
  ): Promise<Summary> {
    const generatedAt = new Date();
    const expiresAt = dayjs().add(7, 'days').toDate();

    const data = { content: summary, generatedAt, expiresAt, productId };

    return await prisma.summary.upsert({
      where: { productId },
      create: data,
      update: data,
    });
  },

  async getReviewSummary(productId: number): Promise<string | null> {
    const summary = await prisma.summary.findFirst({
      where: { AND: [{ id: productId }, { expiresAt: { gt: new Date() } }] },
    });

    return summary ? summary.content : null;
  },
};
