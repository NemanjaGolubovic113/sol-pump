import { CoinData } from './coin';

export interface SectionHeaderProps {
  title: string;
  description: string;
  coinCount: number;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export interface SortingControlsProps {
  sortBy: string | null;
  sortDirection: 'asc' | 'desc';
  onSort: (column: string) => void;
}

export interface CoinGridProps {
  coins: CoinData[];
  animatedRows: boolean[];
  isDeploying: boolean;
  selectedCoin: CoinData | null;
  onCopy: (coin: CoinData) => void;
  isLoading?: boolean;
}

export interface CoinMobileListProps {
  coins: CoinData[];
  animatedRows: boolean[];
  isDeploying: boolean;
  selectedCoin: CoinData | null;
  onCopy: (coin: CoinData) => void;
  isLoading?: boolean;
} 