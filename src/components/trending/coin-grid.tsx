import React from 'react';
import { CoinCard } from './coin-card';
import { CoinLoadingCard } from './coin-loading-card';
import { CoinGridProps } from '@/types/trending';

export const CoinGrid: React.FC<CoinGridProps> = ({
  coins,
  animatedRows,
  isDeploying,
  selectedCoin,
  onCopy,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 px-4 sm:px-0">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <CoinLoadingCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 px-4 sm:px-0">
      {coins.map((coin, index) => (
        <CoinCard
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