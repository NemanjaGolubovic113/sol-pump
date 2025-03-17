import React from 'react';

export const CoinLoadingCard = () => {
  return (
    <div className="relative rounded-xl backdrop-blur-sm shadow-sm border border-[#87efac]/20 bg-[#1b1d28]/60 overflow-hidden">
      {/* Banner section */}
      <div className="w-full h-[26px] bg-[#87efac]/10 animate-pulse" />

      {/* Content container */}
      <div className="p-5">
        {/* Header section */}
        <div className="flex items-center justify-between h-[48px] mb-5">
          <div className="flex items-center gap-3">
            {/* Avatar skeleton */}
            <div className="relative flex-shrink-0 h-12 w-12 rounded-full bg-[#87efac]/10 animate-pulse" />
            
            {/* Title and ticker skeleton */}
            <div className="flex flex-col justify-center gap-2">
              <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
              <div className="h-3 w-16 bg-[#87efac]/10 rounded animate-pulse" />
            </div>
          </div>
          {/* Index skeleton */}
          <div className="h-6 w-8 bg-[#1b1d28]/80 rounded-full animate-pulse" />
        </div>

        {/* Description box skeleton */}
        <div className="mb-5">
          <div className="bg-[#1b1d28]/50 p-3 rounded-lg border border-gray-800 h-[62px]">
            <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse" />
          </div>
        </div>

        {/* Stats section skeleton */}
        <div className="hidden md:grid grid-cols-3 gap-2 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#1b1d28] rounded-lg p-2 h-[56px]">
              <div className="h-3 w-20 bg-white/10 rounded mb-2 animate-pulse" />
              <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Mobile stats section skeleton */}
        <div className="md:hidden flex flex-col gap-2 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#1b1d28] rounded-lg p-3 flex justify-between items-center">
              <div className="h-3 w-20 bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Source info skeleton */}
        <div className="flex items-center gap-2 mb-4 h-5">
          <div className="h-3 w-12 bg-white/10 rounded animate-pulse" />
          <div className="h-3 w-16 bg-[#87efac]/10 rounded animate-pulse" />
        </div>

        {/* Footer skeleton */}
        <div className="flex justify-between items-center h-8">
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 w-6 rounded-full bg-white/10 animate-pulse" />
            ))}
          </div>
          <div className="h-8 w-24 bg-[#87efac]/20 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}; 