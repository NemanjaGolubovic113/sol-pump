'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Copy } from 'lucide-react';

export default function HomeCta() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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

  const scrollToTrendingCoins = () => {
    const trendingCoinsElement = document.getElementById('trending-coins');
    if (trendingCoinsElement) {
      trendingCoinsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="cta"
      ref={sectionRef}
      className={`py-12 md:py-20 border-t border-[#87efac]/10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="relative">
        {/* Background gradient spotlight effect - matching hero */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#87efac]/5 rounded-full blur-[80px] opacity-50 z-0"></div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-lg bg-[#87efac]/10 text-[#87efac] font-mono text-sm font-bold mb-4 md:mb-6">
            <Zap className="mr-2 h-4 w-4" /> READY TO LAUNCH
          </div>

          <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight mb-3 md:mb-5 font-mono px-4 sm:px-0">
            Copy & Launch Your <span className="text-[#87efac]">Meme Coin</span>
          </h2>

          <p className="text-base sm:text-lg text-gray-300 mb-6 max-w-xl mx-auto px-4 sm:px-6">
            Find trending meme coins, copy with one click, and deploy instantly.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 mb-6 px-4 sm:px-0">
            <Button
              size="lg"
              className="w-full sm:w-auto px-6 py-4 sm:py-5 bg-[#87efac] hover:bg-[#87efac]/90 text-[#1b1d28] font-bold shadow-lg shadow-[#87efac]/10"
              onClick={scrollToTrendingCoins}
            >
              <span className="flex items-center justify-center">
                <Copy className="mr-2 h-5 w-5" />
                <span>Start Copying Now</span>
              </span>
            </Button>
          </div>

          {/* Social proof - matching hero style */}
          <div className="px-4 sm:px-0">
            <div className="flex flex-wrap justify-center items-center gap-2 text-xs text-gray-400">
              <div className="flex items-center border border-gray-800 rounded-full px-3 py-1 bg-[#1b1d28]/40">
                <span className="bg-[#ebb305] h-2 w-2 rounded-full mr-1.5"></span>
                <span>100% Automated</span>
              </div>
              <div className="flex items-center border border-gray-800 rounded-full px-3 py-1 bg-[#1b1d28]/40">
                <span className="bg-[#87efac] h-2 w-2 rounded-full mr-1.5"></span>
                <span>Instant Deployment</span>
              </div>
              <div className="flex items-center border border-gray-800 rounded-full px-3 py-1 bg-[#1b1d28]/40">
                <span className="bg-[#87efac] h-2 w-2 rounded-full mr-1.5"></span>
                <span>Community Driven</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
