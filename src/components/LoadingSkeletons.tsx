export function ReviewsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-5 h-5 bg-light-300 rounded animate-pulse" />
            ))}
          </div>
          <div className="w-8 h-5 bg-light-300 rounded animate-pulse" />
        </div>
        <div className="w-20 h-5 bg-light-300 rounded animate-pulse" />
      </div>

      {/* Reviews skeleton */}
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border-b border-light-300 pb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="w-4 h-4 bg-light-300 rounded animate-pulse" />
                ))}
              </div>
              <div className="w-16 h-4 bg-light-300 rounded animate-pulse" />
              <div className="w-20 h-4 bg-light-300 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="w-full h-4 bg-light-300 rounded animate-pulse" />
              <div className="w-3/4 h-4 bg-light-300 rounded animate-pulse" />
              <div className="w-1/2 h-4 bg-light-300 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RecommendationsSkeleton() {
  return (
    <div className="mt-16">
      <div className="w-48 h-8 bg-light-300 rounded animate-pulse mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl bg-light-100 shadow-sm ring-1 ring-light-300">
            <div className="bg-light-200 h-60 sm:h-72 animate-pulse" />
            <div className="p-4 sm:p-5 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="w-3/4 h-6 bg-light-300 rounded animate-pulse" />
                <div className="w-12 h-5 bg-light-300 rounded animate-pulse" />
              </div>
              <div className="w-1/2 h-4 bg-light-300 rounded animate-pulse" />
              <div className="w-full h-4 bg-light-300 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
