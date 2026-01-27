import type { Review } from '../generated/prisma/client';
import { reviewRepository } from '../repositories/review.repository';
import { llmClient } from '../llm/client';
import template from '../prompts/summarize-reviews.txt';

export const reviewService = {
  async getReviews(productId: number): Promise<Review[]> {
    return await reviewRepository.getReviews(productId);
  },

  async summarizeReviews(productId: number): Promise<String> {
    const existingSummary = await reviewRepository.getReviewSummary(productId);
    if (existingSummary) {
      return existingSummary;
    }

    const reviews = await reviewRepository.getReviews(productId, { limit: 10 });
    const joinedReviews = reviews.map((r) => r.content).join('\n\n');
    const prompt = template.replace('{{reviews}}', joinedReviews);

    const { text: summary } = await llmClient.generateText({
      model: 'gpt-4.1',
      prompt,
      temperature: 0.2,
      maxOutputTokens: 500,
    });

    await reviewRepository.storeReviewSummary(productId, summary);

    return summary;
  },
};
