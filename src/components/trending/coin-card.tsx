import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Crown, TrendingUp, MessageCircle, Clock } from 'lucide-react';
import { SocialLinks } from '@/components/social-links';
import { PillIcon } from '@/components/icons';
import { CoinData } from '@/types/coin';
import Image from 'next/image';

interface CoinCardProps {
  coin: CoinData;
  index: number;
  isAnimated: boolean;
  isDeploying: boolean;
  selectedCoinTicker: string | undefined;
  onCopy: (coin: CoinData) => void;
}

const CoinCardComponent: React.FC<CoinCardProps> = (props) => {
  const { index, isAnimated, isDeploying, selectedCoinTicker, onCopy, coin } = props;

  return (
    <div
      className={`relative rounded-xl backdrop-blur-sm shadow-sm transition-all duration-500 transform ${
        isAnimated
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      } ${
        coin.isKingOfHill
          ? 'border-2 border-[#ebb305] bg-gradient-to-b from-[#ebb305]/10 to-transparent'
          : 'border border-[#87efac]/20 bg-[#1b1d28]/60 hover:bg-[#1b1d28]/80'
      } overflow-hidden group hover:shadow-lg hover:shadow-[#87efac]/5 hover:-translate-y-1`}
    >
      {/* Banner section with fixed height */}
      <div
        className={`w-full h-[26px] flex justify-center items-center ${
          coin.isKingOfHill ? 'bg-[#ebb305]' : 'bg-[#87efac]/10'
        }`}
      >
        {coin.isKingOfHill ? (
          <>
            <Crown className="h-3.5 w-3.5 mr-1.5 text-[#1b1d28]" />
            <span className="text-xs font-mono font-bold text-[#1b1d28]">
              KING OF HILL
            </span>
          </>
        ) : (
          <>
            <TrendingUp className="h-3.5 w-3.5 mr-1.5 text-[#87efac]" />
            <span className="text-xs font-mono font-bold text-[#87efac]">
              TRENDING COIN
            </span>
          </>
        )}
      </div>

      {/* Content container with exact padding */}
      <div className="p-5">
        {/* Header section with fixed height */}
        <div className="flex items-center justify-between h-[48px] mb-5">
          <div className="flex items-center gap-3">
            <div
              className={`relative flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center shadow-inner overflow-hidden ${
                coin.isKingOfHill
                  ? 'bg-[#ebb305]/20 text-[#ebb305]'
                  : 'bg-[#87efac]/10 text-[#87efac]'
              }`}
            >
              {coin.imageUrl ? (
                <Image
                  src={coin.imageUrl.startsWith('http') ? coin.imageUrl : `/tokens/placeholder.png`}
                  alt={coin.title}
                  width={48}
                  height={48}
                  className="h-full w-full object-cover rounded-full"
                  onError={(e) => {
                    // @ts-ignore - Next.js Image doesn't have onError in its type definitions
                    e.currentTarget.src = '/tokens/placeholder.png';
                  }}
                />
              ) : (
                <div className="text-lg font-bold">
                  {coin.ticker.charAt(0)}
                </div>
              )}
              {coin.isKingOfHill && (
                <div className="absolute -top-1 -right-1 bg-[#ebb305] rounded-full p-0.5">
                  <Crown className="h-3 w-3 text-[#1b1d28]" />
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center h-12">
              <h3 className="font-medium text-base text-white leading-tight">
                {coin.title}
              </h3>
              <div
                className={`font-mono text-sm ${coin.isKingOfHill ? 'text-[#ebb305]' : 'text-[#87efac]'}`}
              >
                ${coin.ticker}
              </div>
            </div>
          </div>
          <div className="text-xs font-mono text-gray-400 bg-[#1b1d28]/80 px-2 py-1 rounded-full h-6 flex items-center">
            #{index + 1}
          </div>
        </div>

        {/* Description box with fixed height */}
        <div className="mb-5">
          <div className="bg-[#1b1d28]/50 p-3 rounded-lg border border-gray-800 h-[62px] flex items-center">
            <p className="text-sm text-gray-300 line-clamp-2">
              {coin.description}
            </p>
          </div>
        </div>

        {/* Stats section with fixed heights */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {/* Each stat box has exact same dimensions */}
          <div className="bg-[#1b1d28] rounded-lg p-2 h-[56px] flex flex-col justify-center">
            <div className="text-xs text-gray-400 mb-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" /> Market Cap
            </div>
            <div className="text-sm font-mono font-bold text-white">
              {coin.marketCap}
            </div>
          </div>
          <div className="bg-[#1b1d28] rounded-lg p-2 h-[56px] flex flex-col justify-center">
            <div className="text-xs text-gray-400 mb-1 flex items-center">
              <MessageCircle className="h-3 w-3 mr-1" /> Replies
            </div>
            <div className="text-sm font-mono font-bold text-white">
              {coin.replies.toLocaleString()}
            </div>
          </div>
          <div className="bg-[#1b1d28] rounded-lg p-2 h-[56px] flex flex-col justify-center">
            <div className="text-xs text-gray-400 mb-1 flex items-center">
              <Clock className="h-3 w-3 mr-1" /> Last Trade
            </div>
            <div className="text-sm font-mono font-bold text-white">
              {coin.lastTrade}
            </div>
          </div>
        </div>

        {/* Source info with fixed height */}
        <div className="flex items-center text-xs text-gray-400 mb-4 h-5">
          <span>Source:</span>
          <span className="text-[#87efac] ml-1 flex items-center">
            <PillIcon /> <span className="ml-1">{coin.source}</span>
          </span>
        </div>

        {/* Footer with social links and copy button */}
        <div className="flex justify-between items-center h-8">
          <SocialLinks socials={coin.socials} size="sm" />

          <Button
            variant="ghost"
            size="sm"
            className="bg-[#87efac] hover:bg-[#87efac]/80 text-[#1b1d28] text-xs font-bold px-3 py-1.5 h-8 rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-md flex items-center justify-center"
            onClick={() => onCopy(coin)}
            disabled={isDeploying && selectedCoinTicker === coin.ticker}
          >
            <span className="flex items-center">
              {isDeploying && selectedCoinTicker === coin.ticker ? (
                <>
                  <span className="h-3 w-3 mr-1.5 rounded-full bg-white animate-pulse"></span>
                  Deploying...
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1.5" /> 1-Click Copy
                </>
              )}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

// Avoid unnecessary re-renders with memo
export const CoinCard = memo(CoinCardComponent); 