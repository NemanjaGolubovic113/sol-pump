import React, { memo } from 'react';
import Link from 'next/link';
import { Zap } from 'lucide-react';

const LogoComponent: React.FC = () => {
  return (
    <Link
      href="/"
      className="flex items-center group transition-all duration-300 hover:scale-105"
    >
      <div className="bg-[#87efac]/10 p-1.5 rounded-lg mr-2 transition-all duration-300 group-hover:bg-[#87efac]/20 group-hover:rotate-12">
        <Zap className="h-5 w-5 text-[#87efac]" />
      </div>
      <div className="flex items-center">
        <span className="font-mono text-xl font-bold text-white">
          copy
        </span>
        <span className="font-mono text-xl font-bold text-[#87efac]">
          meme
        </span>
      </div>
    </Link>
  );
};

export const Logo = memo(LogoComponent); 