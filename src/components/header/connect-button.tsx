import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, Check } from 'lucide-react';

interface ConnectButtonProps {
  isConnected: boolean;
  onConnect: () => void;
}

const ConnectButtonComponent: React.FC<ConnectButtonProps> = ({ isConnected, onConnect }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className={`hidden sm:flex items-center px-3 py-1.5 h-auto border-[#87efac]/40 text-[#87efac] hover:text-[#87efac] hover:bg-[#87efac]/10 text-sm font-mono transition-all duration-300 ${isConnected ? 'bg-[#87efac]/10' : ''}`}
      onClick={onConnect}
    >
      {isConnected ? (
        <>
          <Check className="mr-1.5 h-3.5 w-3.5" />
          <span>Connected</span>
        </>
      ) : (
        <>
          <Wallet className="mr-1.5 h-3.5 w-3.5" />
          <span>Connect</span>
        </>
      )}
    </Button>
  );
};

export const ConnectButton = memo(ConnectButtonComponent); 