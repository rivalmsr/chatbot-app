import Skeleton from 'react-loading-skeleton';

function ReviewsSkeleton() {
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

export default ReviewsSkeleton;
