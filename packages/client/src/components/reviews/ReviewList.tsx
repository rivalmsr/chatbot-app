import axios from 'axios';
import StarRating from './StarRating';
import { HiSparkles } from 'react-icons/hi2';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { useCallback, useMemo, useState } from 'react';
import ReviewsSkeleton from './ReviewsSkeleton';
import SummarySkeleton from './SummarySkeleton';

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

type SummarizeResponse = {
  summary: string;
};

type ReviewListProps = {
  productId: number;
};

function ReviewList({ productId }: ReviewListProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState<boolean>(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const fetchReviews = (): Promise<GetReviewsResponse> =>
    axios
      .get<GetReviewsResponse>(`/api/products/${productId}/reviews`)
      .then((res) => res.data);

  const { data, isLoading, error } = useQuery<GetReviewsResponse>({
    queryKey: ['reviews', productId],
    queryFn: fetchReviews,
  });

  const onSummarize = useCallback(async () => {
    setIsSummaryLoading(true);
    setSummaryError(null);

    try {
      const response = await axios.post<SummarizeResponse>(
        `/api/products/${productId}/reviews/summarize`
      );

      setSummary(response.data.summary);
    } catch (error) {
      console.log(error);
      setSummaryError('Could not summarize the reviews. Try again!');
    } finally {
      setIsSummaryLoading(false);
    }
  }, [productId]);

  const currentSummary = useMemo(
    () => data?.summary || summary,
    [data, summary]
  );

  if (isLoading) {
    return <ReviewsSkeleton />;
  }

  if (error) {
    return (
      <p className="text-red-500">Could not fetch the reviews. Try again!</p>
    );
  }

  if (!data || !data.reviews.length) {
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
              onClick={onSummarize}
              disabled={isSummaryLoading}
              className="cursor-pointer"
            >
              <HiSparkles />
              Summarize
            </Button>

            <div className="pt-2">
              {isSummaryLoading && <SummarySkeleton />}
              {summaryError && <p className="text-red-500">{summaryError}</p>}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-5">
        {data.reviews.map((review) => (
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
