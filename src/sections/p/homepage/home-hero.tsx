'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Zap, Copy } from 'lucide-react';
import VideoModal from './video-modal';

export default function HomeHero() {
  const [isVisible, setIsVisible] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // YouTube video ID - replace this with your actual video ID
  const videoId = 'dQw4w9WgXcQ'; // Example: Rick Astley - Never Gonna Give You Up

  // Fade-in animation on component mount - keeping this as requested
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const scrollToTrendingCoins = () => {
    const trendingCoinsElement = document.getElementById('trending-coins');
    if (trendingCoinsElement) {
      trendingCoinsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Removing the pulse animation effect for performance improvement

  // Open video modal
  const openVideoModal = () => {
    setVideoModalOpen(true);
  };

  return (
    <>
      <section className="pt-6 sm:pt-8 md:pt-16 pb-6 sm:pb-8 md:pb-12 border-b border-[#87efac]/10 relative">
        {/* Background gradient spotlight effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] h-[300px] sm:h-[500px] bg-[#87efac]/5 rounded-full blur-[80px] opacity-50 z-0"></div>

        <div
          className={`relative z-10 max-w-2xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div className="inline-flex items-center px-3 py-1 rounded-lg bg-[#87efac]/10 text-[#87efac] font-mono text-xs sm:text-sm font-bold mb-3 sm:mb-4 md:mb-6">
            <Zap className="mr-1.5 h-3 w-3 sm:h-4 sm:w-4" /> #1 MEME COIN COPIER TOOL
          </div>

          <h1 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl tracking-tight mb-2 sm:mb-3 md:mb-5 font-mono px-2 sm:px-0">
            Copy Trending Meme Coins{' '}
            <span className="text-[#87efac]">with 1-Click</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-4 sm:mb-6 max-w-xl mx-auto px-2 sm:px-6">
            Find trending coins on Pump.fun, click once, and deploy your copy on
            Raydium.{' '}
            <span className="font-semibold">It&apos;s that simple.</span>
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-2 sm:px-0">
            <Button
              size="lg"
              className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-4 md:py-5 bg-[#87efac] hover:bg-[#87efac]/90 text-[#1b1d28] font-bold shadow-lg shadow-[#87efac]/10 text-sm sm:text-base"
              onClick={scrollToTrendingCoins}
            >
              <span className="flex items-center justify-center">
                <Copy className="mr-1.5 h-4 w-4 sm:h-5 sm:w-5" />
                <span>Start Copying Now</span>
              </span>
            </Button>

            {/* Video button - Opens modal now */}
            <Button
              variant="ghost"
              size="lg"
              className="w-full sm:w-auto mt-2 sm:mt-0 px-4 sm:px-5 py-3 sm:py-4 md:py-5 bg-transparent border border-gray-700/50 text-gray-300 hover:text-[#87efac] hover:bg-white/5 hover:border-gray-600 shadow-sm flex items-center justify-center text-sm sm:text-base"
              onClick={openVideoModal}
            >
              <div className="mr-1.5 sm:mr-2">
                <Play
                  className="h-4 w-4 sm:h-5 sm:w-5 text-[#87efac]"
                  fill="rgba(135, 239, 172, 0.2)"
                />
              </div>
              How It Works
            </Button>
          </div>

          {/* Social proof */}
          <div className="px-2 sm:px-0">
            <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 text-xs text-gray-400">
              <div className="flex items-center border border-gray-800 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 bg-[#1b1d28]/40">
                <span className="bg-[#ebb305] h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full mr-1 sm:mr-1.5"></span>
                <span>100% Automated</span>
              </div>
              <div className="flex items-center border border-gray-800 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 bg-[#1b1d28]/40">
                <span className="bg-[#87efac] h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full mr-1 sm:mr-1.5"></span>
                <span>Instant Deployment</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        videoId={videoId}
      />
    </>
  );
}
