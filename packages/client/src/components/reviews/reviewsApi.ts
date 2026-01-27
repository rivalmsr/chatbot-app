import axios from 'axios';

export type Review = {
  id: string;
  author: string;
  rating: number;
  content: string;
  productId: number;
};

export type GetReviewsResponse = {
  summary: string;
  reviews: Review[];
};

export type SummarizeResponse = {
  summary: string;
};

const reviewsApi = {
  async fetchReviews(productId: number): Promise<GetReviewsResponse> {
    return axios
      .get<GetReviewsResponse>(`/api/products/${productId}/reviews`)
      .then((res) => res.data);
  },

  async summarizeReviews(productId: number): Promise<SummarizeResponse> {
    return axios
      .post<SummarizeResponse>(`/api/products/${productId}/reviews/summarize`)
      .then((res) => res.data);
  },
};

export default reviewsApi;
