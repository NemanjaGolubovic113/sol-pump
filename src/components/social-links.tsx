import React from 'react';
import { Globe } from 'lucide-react';
import { PillIcon, TwitterXIcon, TelegramIcon } from './icons';
import { CoinData } from '@/types/coin';

interface SocialLinksProps {
  socials?: CoinData['socials'];
  size?: 'sm' | 'md';
}

export const SocialLinks: React.FC<SocialLinksProps> = ({ socials, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'w-5 h-5' : 'w-6 h-6';
  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
  
  if (!socials) return null;

  return (
    <div className="flex items-center gap-2">
      {socials.pumpfun && (
        <a
          href={socials.pumpfun}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-gray-400 hover:text-[#87efac] transition-all duration-300 transform hover:scale-110 flex items-center justify-center ${sizeClasses}`}
          aria-label="View on Pump.fun"
          title="View on Pump.fun"
        >
          <PillIcon />
        </a>
      )}
      {socials.website && (
        <a
          href={socials.website}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-gray-400 hover:text-[#87efac] transition-all duration-300 transform hover:scale-110 flex items-center justify-center ${sizeClasses}`}
          aria-label="Website"
          title="Visit website"
        >
          <Globe className={iconSize} />
        </a>
      )}
      {socials.twitter && (
        <a
          href={socials.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-gray-400 hover:text-[#87efac] transition-all duration-300 transform hover:scale-110 flex items-center justify-center ${sizeClasses}`}
          aria-label="X (Twitter)"
          title="Follow on X"
        >
          <TwitterXIcon />
        </a>
      )}
      {socials.telegram && (
        <a
          href={socials.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-gray-400 hover:text-[#87efac] transition-all duration-300 transform hover:scale-110 flex items-center justify-center ${sizeClasses}`}
          aria-label="Telegram"
          title="Join Telegram"
        >
          <TelegramIcon />
        </a>
      )}
    </div>
  );
}; 