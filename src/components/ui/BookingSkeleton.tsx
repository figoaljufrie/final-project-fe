"use client";

export default function BookingSkeleton() {
  return (
    <div className="w-full">
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="glass-card rounded-2xl p-8 animate-pulse">
          <div className="h-8 bg-gradient-to-r from-rose-100/40 via-rose-50/60 to-rose-100/40 bg-[length:200%_100%] animate-shimmer rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gradient-to-r from-rose-100/40 via-rose-50/60 to-rose-100/40 bg-[length:200%_100%] animate-shimmer rounded-xl"></div>
            ))}
          </div>
        </div>
        
        {/* Filters Skeleton */}
        <div className="glass-card rounded-xl p-6 animate-pulse">
          <div className="sm:flex sm:items-center sm:space-x-4">
            <div className="flex-1">
              <div className="h-10 bg-gradient-to-r from-rose-100/40 via-rose-50/60 to-rose-100/40 bg-[length:200%_100%] animate-shimmer rounded"></div>
            </div>
            <div className="mt-4 sm:mt-0 w-48">
              <div className="h-10 bg-gradient-to-r from-rose-100/40 via-rose-50/60 to-rose-100/40 bg-[length:200%_100%] animate-shimmer rounded"></div>
            </div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="glass-card rounded-xl p-6 animate-pulse">
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="grid grid-cols-7 gap-4 py-4">
                <div className="space-y-2">
                  <div className="h-4 bg-gradient-to-r from-rose-100/40 via-rose-50/60 to-rose-100/40 bg-[length:200%_100%] animate-shimmer rounded w-3/4"></div>
                  <div className="h-3 bg-gradient-to-r from-rose-100/40 via-rose-50/60 to-rose-100/40 bg-[length:200%_100%] animate-shimmer rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-gradient-to-r from-rose-100/40 via-rose-50/60 to-rose-100/40 bg-[length:200%_100%] animate-shimmer rounded"></div>
                <div className="h-4 bg-gradient-to-r from-rose-100/40 via-rose-50/60 to-rose-100/40 bg-[length:200%_100%] animate-shimmer rounded"></div>
                <div className="h-4 bg-gradient-to-r from-rose-100/40 via-rose-50/60 to-rose-100/40 bg-[length:200%_100%] animate-shimmer rounded"></div>
                <div className="h-4 bg-gradient-to-r from-rose-100/40 via-rose-50/60 to-rose-100/40 bg-[length:200%_100%] animate-shimmer rounded"></div>
                <div className="h-6 bg-gradient-to-r from-rose-100/40 via-rose-50/60 to-rose-100/40 bg-[length:200%_100%] animate-shimmer rounded-full w-16"></div>
                <div className="flex space-x-2">
                  <div className="h-8 w-8 bg-gradient-to-r from-rose-100/40 via-rose-50/60 to-rose-100/40 bg-[length:200%_100%] animate-shimmer rounded"></div>
                  <div className="h-8 w-8 bg-gradient-to-r from-rose-100/40 via-rose-50/60 to-rose-100/40 bg-[length:200%_100%] animate-shimmer rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
