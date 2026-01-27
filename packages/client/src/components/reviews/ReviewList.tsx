import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import StarRating from './StarRating';

type Review = {
  id: string;
  author: string;
  rating: number;
  content: string;
  productId: number;
};

type GetReviewsResponse = {
  summary: string;
  reviews: Review[];
};

type ReviewListProps = {
  productId: number;
};

function ReviewList({ productId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchReviews = useCallback(async () => {
    if (!productId) return;
    setIsLoading(true);

    const { data } = await axios.get<GetReviewsResponse>(
      `/api/products/${productId}/reviews`
    );

    setReviews(data.reviews);
    setIsLoading(false);
  }, [productId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReviews();
  }, [fetchReviews]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <Skeleton width={150} />
            <Skeleton width={100} />
            <div className="py-1">
              <Skeleton count={2} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {reviews.map((review) => (
        <div key={review.id}>
          <div className="font-semibold">{review.author}</div>
          <StarRating value={review.rating} />
          <p className="py-2">{review.content}</p>
        </div>
      ))}
    </div>
  );
}

export default ReviewList;
