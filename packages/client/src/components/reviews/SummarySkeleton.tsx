import Skeleton from 'react-loading-skeleton';

type SummarySkeletonProps = {
  className?: string;
};

function SummarySkeleton({ className }: SummarySkeletonProps) {
  return (
    <div className={className}>
      <Skeleton count={2} />
      <Skeleton width={300} />
    </div>
  );
}

export default SummarySkeleton;
