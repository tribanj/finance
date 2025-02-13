// import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="relative">
        {/* Main spinner */}
        <div className="w-24 h-24 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
        
        {/* Animated gradient ring */}
        <div className="absolute top-0 left-0 w-24 h-24 rounded-full border-4 border-transparent border-t-cyan-400 border-r-purple-500 animate-spin-fast">
          {/* Inner glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-500/20 animate-pulse"></div>
        </div>

        {/* Floating dots */}
        <div className="absolute -top-4 -left-4 flex space-x-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>

        {/* Text */}
        <p className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-gray-500 dark:text-gray-400 font-medium">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default Loading;