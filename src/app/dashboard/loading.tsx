export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8 space-y-6">
        <div className="animate-pulse">
          <div className="h-[80px] bg-gray-200 rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[120px] bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="mt-6 h-[400px] bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
} 