import { PumpCoin, PumpApiConfig, KingOfTheHill } from '@/types/pump';

// Use our own API routes instead of calling Pump.fun directly
const API_BASE_URL = 'https://copy-meme-murex.vercel.app/api/pump';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export class PumpApiService {
  private static async fetchWithRetry(url: string, options: RequestInit = {}, retries = MAX_RETRIES): Promise<Response> {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return PumpApiService.fetchWithRetry(url, options, retries - 1);
      }
      throw error;
    }
  }

  static async getCoins(config: Partial<PumpApiConfig> = {}): Promise<PumpCoin[]> {
    try {
      const defaultConfig: PumpApiConfig = {
        sortBy: process.env.NEXT_PUBLIC_PUMP_SORT_BY || 'creationTime',
        marketCapFrom: Number(process.env.NEXT_PUBLIC_PUMP_MARKET_CAP_FROM) || 25000,
        volumeFrom: Number(process.env.NEXT_PUBLIC_PUMP_VOLUME_FROM) || 1.55,
        numHoldersFrom: Number(process.env.NEXT_PUBLIC_PUMP_HOLDERS_FROM) || 25
      };

      const finalConfig = { ...defaultConfig, ...config };
      
      const queryParams = new URLSearchParams({
        sortBy: finalConfig.sortBy,
        marketCapFrom: finalConfig.marketCapFrom.toString(),
        volumeFrom: finalConfig.volumeFrom.toString(),
        numHoldersFrom: finalConfig.numHoldersFrom.toString()
      });

      const response = await this.fetchWithRetry(`${API_BASE_URL}/coins?${queryParams}`);
      const data = await response.json();
      const coins = data as PumpCoin[];

      console.log('Initial coins data:', coins.map(c => ({ 
        name: c.name, 
        imageUrl: c.imageUrl 
      })));

      // Fetch additional details for each coin with retry logic
      const coinsWithDetails = await Promise.all(
        coins.map(async (coin) => {
          try {
            const details = await PumpApiService.getCoinDetails(coin.coinMint);
            if (details) {
              console.log(`Details for ${coin.name}:`, {
                description: details.description,
                image_uri: details.image_uri,
                originalImageUrl: coin.imageUrl
              });
              
              return {
                ...coin,
                description: details.description,
                twitter: details.twitter,
                telegram: details.telegram,
                website: details.website,
                usd_market_cap: details.usd_market_cap,
                last_reply: details.last_reply,
                raydium_pool: details.raydium_pool,
                is_currently_live: details.is_currently_live,
                imageUrl: details.image_uri || coin.imageUrl // Prefer frontend API image if available
              };
            }
          } catch (error) {
            console.warn(`Failed to fetch details for coin ${coin.name}:`, error);
          }
          return coin;
        })
      );

      console.log('Coins with details:', coinsWithDetails.map(c => ({ 
        name: c.name, 
        imageUrl: c.imageUrl 
      })));

      return coinsWithDetails;
    } catch (error) {
      console.error('Error fetching coins from Pump.fun:', error);
      throw error;
    }
  }

  static async getCoinDetails(coinMint: string): Promise<any | null> {
    try {
      const response = await this.fetchWithRetry(`${API_BASE_URL}/coins/${coinMint}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching details for coin ${coinMint}:`, error);
      return null;
    }
  }

  static async getKingOfTheHill(): Promise<KingOfTheHill | null> {
    try {
      const response = await this.fetchWithRetry(`${API_BASE_URL}/coins/king-of-the-hill?includeNsfw=false`);
      const data = await response.json();
      console.log('King of the Hill data:', {
        name: data.name,
        image_uri: data.image_uri
      });
      return data as KingOfTheHill;
    } catch (error) {
      console.error('Error fetching King of the Hill from Pump.fun:', error);
      return null;
    }
  }

  static mapToCoinData(pumpCoin: PumpCoin, isKingOfHill: boolean = false) {
    const mappedData = {
      id: pumpCoin.coinMint,
      title: pumpCoin.name,
      ticker: pumpCoin.ticker,
      marketCap: `$${(pumpCoin as any).usd_market_cap?.toLocaleString() || pumpCoin.marketCap.toLocaleString()}`,
      volume: pumpCoin.volume,
      replies: pumpCoin.numHolders,
      lastTrade: new Date((pumpCoin as any).last_reply || pumpCoin.creationTime).toLocaleString(),
      imageUrl: pumpCoin.imageUrl,
      imageSrc: pumpCoin.imageUrl, // Add imageSrc for consistency
      progress: pumpCoin.bondingCurveProgress,
      snipers: pumpCoin.sniperCount,
      dev: pumpCoin.dev,
      isKingOfHill,
      description: (pumpCoin as any).description,
      isLive: (pumpCoin as any).is_currently_live,
      socials: {
        pumpfun: `https://pump.fun/coin/${pumpCoin.coinMint}`,
        twitter: (pumpCoin as any).twitter,
        telegram: (pumpCoin as any).telegram,
        website: (pumpCoin as any).website
      }
    };

    console.log(`Mapped coin data for ${pumpCoin.name}:`, {
      title: mappedData.title,
      imageUrl: mappedData.imageUrl,
      imageSrc: mappedData.imageSrc
    });

    return mappedData;
  }

  static mapKingOfTheHillToCoinData(koth: KingOfTheHill) {
    const mappedData = {
      id: koth.mint,
      title: koth.name,
      ticker: koth.symbol,
      marketCap: `$${koth.usd_market_cap.toLocaleString()}`,
      volume: koth.virtual_sol_reserves / 1e9, // Convert lamports to SOL
      replies: koth.reply_count,
      lastTrade: new Date(koth.last_reply || koth.king_of_the_hill_timestamp).toLocaleString(),
      imageUrl: koth.image_uri,
      imageSrc: koth.image_uri, // Add imageSrc for consistency
      progress: 100, // King of the Hill is always at 100%
      snipers: 0, // We don't have this info for KotH
      dev: koth.creator,
      description: koth.description,
      isKingOfHill: true,
      isLive: koth.is_currently_live,
      socials: {
        pumpfun: `https://pump.fun/coin/${koth.mint}`,
        website: koth.website || undefined,
        twitter: koth.twitter || undefined,
        telegram: koth.telegram || undefined
      }
    };

    console.log('Mapped King of the Hill data:', {
      title: mappedData.title,
      imageUrl: mappedData.imageUrl,
      imageSrc: mappedData.imageSrc
    });

    return mappedData;
  }
} 