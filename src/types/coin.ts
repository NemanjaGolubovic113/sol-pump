export interface CoinData {
  id: string;
  title: string;
  ticker: string;
  marketCap: string;
  volume: number;
  replies: number;
  lastTrade: string;
  imageUrl: string;
  progress: number;
  snipers: number;
  dev: string;
  description?: string;
  source?: string;
  imageSrc?: string;
  isKingOfHill?: boolean;
  isLive?: boolean;
  socials?: {
    twitter?: string;
    telegram?: string;
    website?: string;
    pumpfun?: string;
  };
} 