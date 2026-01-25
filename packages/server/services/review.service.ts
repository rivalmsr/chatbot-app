import OpenAI from 'openai';
import type { Review } from '../generated/prisma/client';
import { reviewRepository } from '../repositories/review.repository';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const reviewService = {
  async getReviews(productId: number): Promise<Review[]> {
    return await reviewRepository.getReviews(productId);
  },

  async summarizeReviews(productId: number): Promise<String> {
    const reviews = await reviewRepository.getReviews(productId, { limit: 10 });
    const joinedReviews = reviews.map((r) => r.content).join('\n\n');

    const prompt = `Summarize the following customer reviews into a short paragraph lighlighting key themes, both positif and negative:
    ${joinedReviews}`;

    const response = await client.responses.create({
      model: 'gpt-4.1',
      input: prompt,
      temperature: 0.2,
      max_output_tokens: 500,
    });

    return response.output_text;
  },
};
