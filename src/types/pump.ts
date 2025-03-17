export interface PumpHolder {
  holderId: string;
  ownedPercentage: number;
  realizedPnL: number;
  totalCostOfTokensHeld: number;
  totalTokenAmountHeld: number;
  isSniper: boolean;
  unrealizedPnL: number;
}

export interface PumpCoin {
  coinMint: string;
  dev: string;
  name: string;
  ticker: string;
  imageUrl: string;
  creationTime: number;
  numHolders: number;
  marketCap: number;
  volume: number;
  bondingCurveProgress: number;
  sniperCount: number;
  currentMarketPrice: number;
  holders: PumpHolder[];
  description?: string;
  twitter?: string | null;
  telegram?: string | null;
  website?: string | null;
  usd_market_cap?: number;
  last_reply?: number;
  raydium_pool?: string | null;
  is_currently_live?: boolean;
}

export interface KingOfTheHill {
  mint: string;
  name: string;
  symbol: string;
  description: string;
  image_uri: string;
  video_uri: string | null;
  metadata_uri: string;
  twitter: string | null;
  telegram: string | null;
  website: string | null;
  bonding_curve: string;
  associated_bonding_curve: string;
  creator: string;
  created_timestamp: number;
  raydium_pool: string | null;
  complete: boolean;
  virtual_sol_reserves: number;
  virtual_token_reserves: number;
  total_supply: number;
  show_name: boolean;
  king_of_the_hill_timestamp: number;
  market_cap: number;
  reply_count: number;
  last_reply: number;
  nsfw: boolean;
  market_id: string | null;
  inverted: boolean | null;
  is_currently_live: boolean;
  username: string | null;
  profile_image: string | null;
  usd_market_cap: number;
}

export interface PumpApiConfig {
  sortBy: string;
  marketCapFrom: number;
  volumeFrom: number;
  numHoldersFrom: number;
} 