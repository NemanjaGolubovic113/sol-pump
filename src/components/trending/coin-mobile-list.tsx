import React, { memo } from 'react';
import { CoinMobileCard } from './coin-mobile-card';
import { CoinLoadingCard } from './coin-loading-card';
import { CoinMobileListProps } from '@/types/trending';

const CoinMobileListComponent: React.FC<CoinMobileListProps> = ({
  coins,
  animatedRows,
  isDeploying,
  selectedCoin,
  onCopy,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 sm:px-0">
        {[1, 2, 3].map((i) => (
          <CoinLoadingCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 sm:px-0">
      {coins.map((coin, index) => (
        <CoinMobileCard
          key={coin.id}
          coin={coin}
          index={index}
          isAnimated={animatedRows[index]}
          isDeploying={isDeploying}
          selectedCoinTicker={selectedCoin?.ticker}
          onCopy={onCopy}
        />
      ))}
    </div>
  );
};

// Avoid unnecessary re-renders with memo
export const CoinMobileList = memo(CoinMobileListComponent); 