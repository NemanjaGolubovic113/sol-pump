'use client';

import { useEffect, useState, useCallback, Fragment } from 'react';
import { Button } from '@/components/ui/button';
import { X as CloseIcon, ExternalLink, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { DeployedTokenData } from '@/types/tokens';
import BN from 'bn.js';

interface CreatePoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenData: DeployedTokenData;
}

export default function CreatePoolModal({
  isOpen,
  onClose,
  tokenData,
}: CreatePoolModalProps) {
  // State for animation and modal visibility
  const [visible, setVisible] = useState(false);
  const [isCreatingPool, setIsCreatingPool] = useState(false);
  const [startingPrice, setStartingPrice] = useState('0.01');
  const [baseAmount, setBaseAmount] = useState('1000000');
  const [quoteAmount, setQuoteAmount] = useState('10000');
  const [quoteToken, setQuoteToken] = useState('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'); // USDC by default
  const [poolId, setPoolId] = useState<string | null>(null);

  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  // Control body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setVisible(false);
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close modal when escape key is pressed
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleEscape]);

  const handleCreatePool = async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setIsCreatingPool(true);
      
      // Open Raydium in new tab with instructions
      const raydiumUrl = 'https://raydium.io/liquidity/create';
      window.open(raydiumUrl, '_blank');
      
      toast.success('Please complete pool creation on Raydium');
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to open Raydium. Please try again.');
    } finally {
      setIsCreatingPool(false);
    }
  };

  // Don't render anything if modal isn't open
  if (!isOpen) return null;

  return (
    <Fragment>
      {/* Fixed overlay - covers entire viewport */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        {/* Backdrop with blur - fully covers viewport */}
        <div
          className={`fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal container - centered using flex */}
        <div
          className={`relative w-full max-w-md mx-auto p-4 ${
            visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          } transition-all duration-300 z-[10000]`}
        >
          {/* Modal content */}
          <div className="relative w-full bg-[#0d0f17] rounded-xl border-4 border-[#ebb305] overflow-hidden shadow-2xl">
            {/* Close button */}
            <button
              className="absolute top-2 right-2 p-2 text-[#0d0f17] bg-[#ebb305] hover:bg-[#ebb305]/80 rounded-full z-20"
              onClick={onClose}
              aria-label="Close"
            >
              <CloseIcon className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="bg-[#ebb305] p-4 text-center">
              <h2 className="text-[#0d0f17] text-xl font-bold font-mono uppercase tracking-wider">
                CREATE RAYDIUM POOL 🌊
              </h2>
            </div>

            {/* Form */}
            <div className="p-6">
              <div className="bg-[#1b1d28] rounded-lg p-5 mb-5">
                <h3 className="text-lg font-bold mb-4 text-white">
                  <span className="text-[#ebb305]">${tokenData.symbol}</span> Pool Settings
                </h3>

                <div className="space-y-4">
                  <p className="text-white">
                    To create a Raydium pool for your token, you'll need to:
                  </p>
                  
                  <ol className="list-decimal pl-5 text-gray-300 space-y-2">
                    <li>Go to Raydium's liquidity creation page</li>
                    <li>Select "Standard AMM" for the newest CPMM</li>
                    <li>Enter your token's contract address: <span className="text-[#ebb305] font-mono">{tokenData.contractAddress.slice(0, 6)}...{tokenData.contractAddress.slice(-6)}</span></li>
                    <li>Set your desired starting price and initial liquidity</li>
                    <li>Complete the pool creation process</li>
                  </ol>
                  
                  <div className="flex items-center mt-4">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(tokenData.contractAddress);
                        toast.success('Contract address copied!');
                      }}
                      className="flex items-center gap-2 text-white hover:text-[#ebb305] transition-colors"
                    >
                      <span className="font-mono text-sm">
                        {tokenData.contractAddress.slice(0, 8)}...
                        {tokenData.contractAddress.slice(-8)}
                      </span>
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full border-[#ebb305] text-[#ebb305] hover:bg-[#ebb305]/10 font-bold py-3 h-auto text-base"
                  onClick={handleCreatePool}
                  disabled={isCreatingPool}
                >
                  {isCreatingPool ? 'Opening Raydium...' : 'Create Pool on Raydium'}
                </Button>
              </div>

              {/* Footer note */}
              <div className="mt-4 text-center">
                <div className="text-xs text-gray-500">
                  This will redirect you to Raydium to create a Standard AMM pool
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
} 