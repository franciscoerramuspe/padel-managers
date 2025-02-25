export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="h-4 w-64 bg-gray-100 dark:bg-gray-800 rounded-lg" />
        </div>

        {/* DateTime Skeleton */}
        <div className="animate-pulse bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="h-6 w-48 bg-gray-100 dark:bg-gray-700 rounded-lg" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="h-4 w-20 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4" />
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-600 rounded-lg" />
            </div>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 h-64" />
          ))}
        </div>
      </div>
    </div>
  );
} 