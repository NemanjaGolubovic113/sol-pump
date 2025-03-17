import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Zap } from 'lucide-react';
import { SectionHeaderProps } from '@/types/trending';

const SectionHeaderComponent: React.FC<SectionHeaderProps> = ({
  title,
  description,
  coinCount,
  isRefreshing,
  onRefresh,
}) => {
  return (
    <div className="px-4 sm:px-0 mb-6">
      {/* Heading with badge - better mobile design */}
      <div className="flex items-center mb-1.5">
        <div className="bg-[#87efac]/10 p-1.5 rounded-md mr-2 transition-all duration-300">
          <Zap className="h-4 sm:h-5 w-4 sm:w-5 text-[#87efac]" />
        </div>
        <h2 className="text-[#87efac] text-xl sm:text-2xl font-mono font-bold leading-tight">
          {title}
        </h2>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Description and counters */}
        <div className="flex items-center text-xs text-gray-400 mb-4 md:mb-0">
          <p className="mr-3">{description}</p>
          <div className="flex items-center bg-[#1b1d28]/60 rounded-full px-2 py-0.5 border border-gray-800">
            <div className="h-1.5 w-1.5 rounded-full bg-[#87efac] mr-1.5"></div>
            <span className="font-mono">{coinCount} coins</span>
          </div>
        </div>

        {/* Refresh button - mobile tam genişlik, desktop normal */}
        <Button
          variant="outline"
          onClick={onRefresh}
          className="border-[#87efac]/30 text-[#87efac] hover:text-[#87efac] hover:bg-[#87efac]/10 font-mono text-xs transition-all duration-300 h-10 px-4 flex-shrink-0 shadow-sm md:ml-auto w-full md:w-auto"
          disabled={isRefreshing}
        >
          <RefreshCcw
            className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
          />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh List'}</span>
        </Button>
      </div>
    </div>
  );
};

// Avoid unnecessary re-renders with memo
export const SectionHeader = memo(SectionHeaderComponent);