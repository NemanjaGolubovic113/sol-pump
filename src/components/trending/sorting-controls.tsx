import React, { memo } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { SortingControlsProps } from '@/types/trending';

export const SortingControlsComponent: React.FC<SortingControlsProps> = ({
  sortBy,
  sortDirection,
  onSort,
}) => {
  // Helper for rendering sort indicator
  const renderSortIndicator = (column: string) => {
    if (sortBy !== column) return null;
    return sortDirection === 'asc' ? (
      <ArrowUp className="h-3 w-3 ml-1" />
    ) : (
      <ArrowDown className="h-3 w-3 ml-1" />
    );
  };

  // Helper for column styling
  const getColumnStyle = (column: string) => {
    return `cursor-pointer px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors rounded-lg ${
      sortBy === column
        ? 'text-white bg-[#1b1d28] border border-[#87efac]/25'
        : 'text-gray-400 hover:text-gray-300 hover:bg-[#1b1d28]/50'
    }`;
  };

  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2 px-4 sm:px-0">
        <button
          onClick={() => onSort('marketCap')}
          className={getColumnStyle('marketCap')}
        >
          <div className="flex items-center">
            Market Cap
            {renderSortIndicator('marketCap')}
          </div>
        </button>
        <button onClick={() => onSort('title')} className={getColumnStyle('title')}>
          <div className="flex items-center">
            Name
            {renderSortIndicator('title')}
          </div>
        </button>
        <button onClick={() => onSort('ticker')} className={getColumnStyle('ticker')}>
          <div className="flex items-center">
            Ticker
            {renderSortIndicator('ticker')}
          </div>
        </button>
        <button
          onClick={() => onSort('replies')}
          className={getColumnStyle('replies')}
        >
          <div className="flex items-center">
            Replies
            {renderSortIndicator('replies')}
          </div>
        </button>
        <button
          onClick={() => onSort('lastTrade')}
          className={getColumnStyle('lastTrade')}
        >
          <div className="flex items-center">
            Last Trade
            {renderSortIndicator('lastTrade')}
          </div>
        </button>
      </div>
    </div>
  );
};

export const SortingControls = memo(SortingControlsComponent); 