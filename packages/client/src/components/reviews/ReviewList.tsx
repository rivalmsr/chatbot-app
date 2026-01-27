import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import StarRating from './StarRating';
import { useQuery } from '@tanstack/react-query';

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
  const fetchReviews = (): Promise<GetReviewsResponse> =>
    axios
      .get<GetReviewsResponse>(`/api/products/${productId}/reviews`)
      .then((res) => res.data);

  const { data, isLoading, error } = useQuery<GetReviewsResponse>({
    queryKey: ['reviews', productId],
    queryFn: fetchReviews,
  });

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

  if (error) {
    return (
      <p className="text-red-500">Could not fetch the reviews. Try again!</p>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {data &&
        data.reviews.map((review) => (
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
