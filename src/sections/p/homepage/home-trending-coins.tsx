'use client';

import { useState, useEffect, useRef } from 'react';
import { CoinData } from '@/types/coin';
import { PumpApiService } from '@/services/pumpApi';
import DeploySuccessModal from './deploy-success-modal';
import CreatePoolModal from './create-pool-modal';
import { SectionHeader } from '@/components/trending/section-header';
import { SortingControls } from '@/components/trending/sorting-controls';
import { CoinGrid } from '@/components/trending/coin-grid';
import { CoinMobileList } from '@/components/trending/coin-mobile-list';
import { DeployedTokenData } from '@/types/tokens';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { createToken, createPumpFunToken } from '@/actions/createToken';
import toast from 'react-hot-toast';
import { PublicKey } from '@solana/web3.js';
import { getMint } from '@solana/spl-token';
import { KingOfTheHill } from '@/types/pump';
import { createTipTransaction } from '@/actions/feesTx';

export default function HomeTrendingCoins() {
  // State for coins and UI
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<string | null>('marketCap');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isVisible, setIsVisible] = useState(false);
  const [animatedRows, setAnimatedRows] = useState<boolean[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kingOfTheHill, setKingOfTheHill] = useState<CoinData | null>(null);

  // States for deployment and success modal
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentSuccess, setDeploymentSuccess] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<CoinData | null>(null);
  const [showCreatePoolModal, setShowCreatePoolModal] = useState(false);
  const [deployedTokenData, setDeployedTokenData] = useState<DeployedTokenData>({
    name: '',
    symbol: '',
    contractAddress: '',
    // raydiumUrl: '',
  });

  // Add loading state
  const [isLoading, setIsLoading] = useState(true);

  const sectionRef = useRef<HTMLDivElement>(null);

  const { publicKey, sendTransaction, connected } = useWallet();
  const { connection } = useConnection();
  const { setVisible: setWalletModalVisible } = useWalletModal();

  // Check if mobile view based on screen width
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Detect when section enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Load initial data
  const fetchTrendingCoins = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Fetch King of the Hill with fallback
      let koth: KingOfTheHill | null = null;
      try {
        koth = await PumpApiService.getKingOfTheHill();
        if (koth) {
          setKingOfTheHill(PumpApiService.mapKingOfTheHillToCoinData(koth));
        }
      } catch (kothError) {
        console.error('Error fetching King of the Hill:', kothError);
        // Continue without King of the Hill
      }

      // Fetch regular coins
      const pumpCoins = await PumpApiService.getCoins();
      const mappedCoins = pumpCoins.map(coin => PumpApiService.mapToCoinData(coin));
      
      // Filter out the King of the Hill from regular coins if it exists
      let filteredCoins = mappedCoins;
      if (koth && koth.mint) {
        const kothMint = koth.mint;
        filteredCoins = mappedCoins.filter(coin => coin.id !== kothMint);
      }

      setCoins(filteredCoins);
      setAnimatedRows(new Array(filteredCoins.length + (koth ? 1 : 0)).fill(false));

      // Stagger row animations
      const timer = setTimeout(() => {
        filteredCoins.forEach((_, index) => {
          setTimeout(() => {
            setAnimatedRows((prev) => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
          }, index * 100);
        });
      }, 300);

      return () => clearTimeout(timer);
    } catch (error) {
      console.error('Error fetching trending coins:', error);
      setError('Unable to fetch trending coins. Please check your connection and try again.');
      // Set empty state to prevent loading indicator from spinning indefinitely
      setCoins([]);
      setKingOfTheHill(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingCoins();
  }, []);

  // Handle refresh action with animation and error handling
  const handleRefresh = async () => {
    if (isRefreshing) return; // Prevent multiple refreshes
    
    setIsRefreshing(true);
    setAnimatedRows(new Array(coins.length).fill(false));
    setError(null);

    try {
      await fetchTrendingCoins();
      toast.success('Data refreshed successfully!');
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Failed to refresh data. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle coin copy/deploy
  const handleCopy = async (selectedCoin: CoinData) => {
    if (!connected) {
      setWalletModalVisible(true);
      return;
    }

    try {
      setSelectedCoin(selectedCoin);
      setIsDeploying(true);

      // Get the original token's decimals with fallback
      let decimals = 9; // Default to 9 decimals if we can't fetch
      try {
        const originalMint = new PublicKey(selectedCoin.id);
        const mintInfo = await getMint(connection, originalMint);
        decimals = mintInfo.decimals;
      } catch (error) {
        console.error('Error fetching token decimals:', error);
        toast.error('Could not fetch token decimals, using default value of 9');
      }

      // Create token
      // const { transaction, mintKeypair, tokenATA } = await createToken({
      //   connection,
      //   payer: publicKey!,
      //   name: `${selectedCoin.title}`,
      //   symbol: `${selectedCoin.ticker}`,
      //   description: selectedCoin.description || '',
      //   decimals, // Use the original token's decimals or fallback
      //   totalSupply: 1_000_000_000, // 1 billion tokens
      //   imageUrl: selectedCoin.imageUrl,
      //   websiteUrl: selectedCoin.socials?.website,
      //   twitterUrl: selectedCoin.socials?.twitter,
      //   telegramUrl: selectedCoin.socials?.telegram,
      // });

      const { transaction, mintKeypair, tokenATA } = await createPumpFunToken({
        connection,
        payer: publicKey!,
        name: `${selectedCoin.title}`,
        symbol: `${selectedCoin.ticker}`,
        description: selectedCoin.description || '',
        decimals, // Use the original token's decimals or fallback
        totalSupply: 1_000_000_000, // 1 billion tokens
        imageUrl: selectedCoin.imageUrl,
        websiteUrl: selectedCoin.socials?.website,
        twitterUrl: selectedCoin.socials?.twitter,
        telegramUrl: selectedCoin.socials?.telegram,
      });
      return false


      // Get latest blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey!;

      // Partial sign with mint keypair
      transaction.partialSign(mintKeypair);

      // Send transaction
      const signature = await sendTransaction(transaction, connection);
      
      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature);
      
      if (confirmation.value.err) {
        throw new Error('Transaction failed');
      }

      // Set deployed token data
      setDeployedTokenData({
        name: selectedCoin.title,
        symbol: selectedCoin.ticker,
        contractAddress: mintKeypair.publicKey.toBase58(),
      });

      // Show success modal
      setDeploymentSuccess(true);
      toast.success('Token created successfully!');

    } catch (error) {
      console.error('Error creating token:', error);
      toast.error('Failed to create token. Please try again.');
    } finally {
      setIsDeploying(false);
    }
  };

  // Close success modal
  const closeSuccessModal = () => {
    setDeploymentSuccess(false);
    setSelectedCoin(null);
  };

  // Handle opening create pool modal from success modal
  const handleOpenCreatePoolModal = () => {
    setShowCreatePoolModal(true);
    setDeploymentSuccess(false);
  };

  // Close create pool modal
  const closeCreatePoolModal = () => {
    setShowCreatePoolModal(false);
  };

  // Handle sorting
  const handleSort = (sortColumn: string) => {
    // Reset row animations first
    setAnimatedRows(new Array(coins.length).fill(false));

    if (sortBy === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(sortColumn);
      setSortDirection('desc'); // Default to descending on new column
    }

    // Re-animate rows after sorting
    setTimeout(() => {
      coins.forEach((_, index) => {
        setTimeout(() => {
          setAnimatedRows((prev) => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
        }, index * 80);
      });
    }, 50);
  };

  // Sort the coins based on current sort settings
  const sortedCoins = [...coins].sort((a, b) => {
    if (!sortBy) return 0;

    let comparison = 0;
    if (sortBy === 'marketCap') {
      // Extract numeric value from market cap string (removing $ and M)
      const aValue = parseFloat(a.marketCap.replace(/[$M]/g, ''));
      const bValue = parseFloat(b.marketCap.replace(/[$M]/g, ''));
      comparison = aValue - bValue;
    } else if (sortBy === 'replies') {
      comparison = a.replies - b.replies;
    } else if (sortBy === 'title') {
      comparison = a.title.localeCompare(b.title);
    } else if (sortBy === 'ticker') {
      comparison = a.ticker.localeCompare(b.ticker);
    } else if (sortBy === 'lastTrade') {
      // Simple string comparison for demo
      comparison = a.lastTrade.localeCompare(b.lastTrade);
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Combine King of the Hill with sorted coins
  const allCoins = kingOfTheHill ? [kingOfTheHill, ...sortedCoins] : sortedCoins;

  return (
    <section
      id="trending-coins"
      ref={sectionRef}
      className={`py-8 md:py-12 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="relative">
        {/* Background elements */}
        <div className="absolute -right-20 top-10 w-40 h-40 bg-[#87efac]/5 rounded-full blur-[80px] z-0 hidden sm:block"></div>
        <div className="absolute -left-20 bottom-10 w-40 h-40 bg-[#ebb305]/5 rounded-full blur-[80px] z-0 hidden sm:block"></div>

        {/* Content */}
        <div className="relative z-10">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-md transition-colors"
                disabled={isRefreshing}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Section header */}
          <SectionHeader
            title="Trending Coins on Pump.fun"
            description="Discover and copy the hottest tokens"
            coinCount={allCoins.length}
            isRefreshing={isRefreshing}
            onRefresh={handleRefresh}
          />

          {/* Show loading state */}
          {isLoading && !error && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#87efac]"></div>
            </div>
          )}

          {/* Show empty state */}
          {!isLoading && !error && allCoins.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No trending coins available at the moment.</p>
              <button
                onClick={handleRefresh}
                className="mt-4 px-6 py-2 bg-[#87efac]/20 hover:bg-[#87efac]/30 text-[#87efac] rounded-md transition-colors"
                disabled={isRefreshing}
              >
                Refresh
              </button>
            </div>
          )}

          {/* Sorting controls - Only show when not loading and have coins */}
          {!isLoading && !error && allCoins.length > 0 && (
            <SortingControls
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
          )}

          {/* Responsive coins display */}
          {!isLoading && !error && allCoins.length > 0 && (
            isMobile ? (
              <CoinMobileList
                coins={allCoins}
                animatedRows={animatedRows}
                isDeploying={isDeploying}
                selectedCoin={selectedCoin}
                onCopy={handleCopy}
                isLoading={isLoading}
              />
            ) : (
              <CoinGrid
                coins={allCoins}
                animatedRows={animatedRows}
                isDeploying={isDeploying}
                selectedCoin={selectedCoin}
                onCopy={handleCopy}
                isLoading={isLoading}
              />
            )
          )}
        </div>
      </div>

      {/* Deployment Success Modal */}
      <DeploySuccessModal
        isOpen={deploymentSuccess}
        onClose={closeSuccessModal}
        onCreatePool={handleOpenCreatePoolModal}
        tokenData={{
          name: deployedTokenData.name,
          symbol: deployedTokenData.symbol,
          contractAddress: deployedTokenData.contractAddress,
        }}
      />

      {/* Create Pool Modal */}
      <CreatePoolModal
        isOpen={showCreatePoolModal}
        onClose={closeCreatePoolModal}
        tokenData={{
          name: deployedTokenData.name,
          symbol: deployedTokenData.symbol,
          contractAddress: deployedTokenData.contractAddress,
        }}
      />
    </section>
  );
}
