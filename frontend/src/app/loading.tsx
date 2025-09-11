// frontend/src/app/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        {/* Animated Coffee Cup */}
        <div className="relative mb-8">
          <div className="text-6xl animate-bounce">☕</div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
            <div className="flex space-x-1">
              <div className="w-1 h-3 bg-amber-400 rounded-full animate-pulse"></div>
              <div className="w-1 h-4 bg-amber-500 rounded-full animate-pulse delay-75"></div>
              <div className="w-1 h-3 bg-amber-400 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
        </div>
        
        {/* Loading Text */}
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Brewing your content...</h2>
        <p className="text-gray-600">Just a moment while we prepare everything.</p>
        
        {/* Loading Bar */}
        <div className="mt-6 w-48 mx-auto">
          <div className="bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
