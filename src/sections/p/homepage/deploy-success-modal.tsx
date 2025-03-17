'use client';

import { useEffect, useState, useCallback, Fragment } from 'react';
import { Button } from '@/components/ui/button';
import { X as CloseIcon, ExternalLink, Copy } from 'lucide-react';
import { DeploySuccessModalProps } from '@/types/modals';
import toast from 'react-hot-toast';

export default function DeploySuccessModal({
  isOpen,
  onClose,
  tokenData,
  onCreatePool,
}: DeploySuccessModalProps) {
  // State for animation and modal visibility
  const [visible, setVisible] = useState(false);

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

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(tokenData.contractAddress);
    toast.success('Token address copied!');
  };

  const handleCreatePool = () => {
    if (onCreatePool) {
      onCreatePool();
    } else {
      // Fallback to opening Raydium directly
      window.open('https://raydium.io/liquidity/create', '_blank');
      onClose();
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
          <div className="relative w-full bg-[#0d0f17] rounded-xl border-4 border-[#87efac] overflow-hidden shadow-2xl">
            {/* Close button */}
            <button
              className="absolute top-2 right-2 p-2 text-[#0d0f17] bg-[#87efac] hover:bg-[#87efac]/80 rounded-full z-20"
              onClick={onClose}
              aria-label="Close"
            >
              <CloseIcon className="h-5 w-5" />
            </button>

            {/* Success header */}
            <div className="bg-[#87efac] p-4 text-center">
              <h2 className="text-[#0d0f17] text-xl font-bold font-mono uppercase tracking-wider">
                TOKEN DEPLOYED! 🚀
              </h2>
            </div>

            {/* Token details */}
            <div className="p-6">
              {/* Token info */}
              <div className="bg-[#1b1d28] rounded-lg p-5 mb-5">
                <h3 className="text-lg font-bold mb-4 text-white">
                  <span className="text-[#87efac]">${tokenData.symbol}</span> Details
                </h3>

                {/* Token details grid */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Name:</span>
                    <span className="text-white font-medium">{tokenData.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Symbol:</span>
                    <span className="text-[#87efac] font-bold">${tokenData.symbol}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Contract:</span>
                    <button
                      onClick={handleCopyAddress}
                      className="flex items-center gap-2 text-white hover:text-[#87efac] transition-colors"
                    >
                      <span className="font-mono text-sm">
                        {tokenData.contractAddress.slice(0, 4)}...
                        {tokenData.contractAddress.slice(-4)}
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
                  className="w-full border-[#87efac] text-[#87efac] hover:bg-[#87efac]/10 font-bold py-3 h-auto text-base"
                  onClick={onClose}
                >
                  Deploy Another Token
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full border-[#ebb305] text-[#ebb305] hover:bg-[#ebb305]/10 font-bold py-3 h-auto text-base"
                  onClick={handleCreatePool}
                >
                  Create Raydium Pool
                </Button>
              </div>

              {/* Footer note */}
              <div className="mt-4 text-center">
                <div className="text-xs text-gray-500">
                  Share your token with the community! 🚀
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
