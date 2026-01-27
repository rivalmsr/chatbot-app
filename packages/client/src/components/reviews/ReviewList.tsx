import StarRating from './StarRating';
import { HiSparkles } from 'react-icons/hi2';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { useMemo } from 'react';
import ReviewsSkeleton from './ReviewsSkeleton';
import SummarySkeleton from './SummarySkeleton';
import reviewsApi from './reviewsApi';
import type { GetReviewsResponse, SummarizeResponse } from './reviewsApi';

type ReviewListProps = {
  productId: number;
};

function ReviewList({ productId }: ReviewListProps) {
  const reviewsQuery = useQuery<GetReviewsResponse>({
    queryKey: ['reviews', productId],
    queryFn: () => reviewsApi.fetchReviews(productId),
  });

  const summaryMutation = useMutation<SummarizeResponse>({
    mutationFn: () => reviewsApi.summarizeReviews(productId),
  });

  const currentSummary = useMemo(
    () => reviewsQuery.data?.summary || summaryMutation.data?.summary,
    [reviewsQuery, summaryMutation]
  );

  if (reviewsQuery.isPending) {
    return <ReviewsSkeleton />;
  }

  if (reviewsQuery.isError) {
    return (
      <p className="text-red-500">Could not fetch the reviews. Try again!</p>
    );
  }

  if (!reviewsQuery.data || !reviewsQuery.data.reviews.length) {
    return null;
  }

  return (
    <div>
      <div className="mb-5">
        {currentSummary ? (
          <p>{currentSummary}</p>
        ) : (
          <div>
            <Button
              onClick={() => summaryMutation.mutate()}
              disabled={summaryMutation.isPending}
              className="cursor-pointer"
            >
              <HiSparkles />
              Summarize
            </Button>

            <div className="pt-2">
              {summaryMutation.isPending && <SummarySkeleton />}
              {summaryMutation.isError && (
                <p className="text-red-500">
                  Could not summarize the reviews. Try again!
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-5">
        {reviewsQuery.data.reviews.map((review) => (
          <div key={review.id}>
            <div className="font-semibold">{review.author}</div>
            <StarRating value={review.rating} />
            <p className="py-2">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewList;
