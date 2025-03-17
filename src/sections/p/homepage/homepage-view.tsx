'use client';

import { useEffect, useState } from 'react';
import HomeHero from './home-hero';
import HomeTrendingCoins from './home-trending-coins';
import HomeHeader from './home-header';
import HomeFooter from './home-footer';
import HomeCta from './home-cta';

export default function HomepageView() {
  const [isLoaded, setIsLoaded] = useState(false);

  // Handle initial page load animation
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Background particles (simplified version for performance)
  useEffect(() => {
    const createParticle = () => {
      const particles = document.getElementById('particles');
      if (!particles) return;

      const particle = document.createElement('div');
      const size = Math.random() * 6 + 2;
      const left = Math.random() * 100;
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 5;
      const opacity = Math.random() * 0.3 + 0.1;

      particle.className = 'absolute bg-[#87efac] rounded-full';
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${left}%`;
      particle.style.top = '-20px';
      particle.style.opacity = opacity.toString();
      particle.style.animation = `float ${duration}s linear ${delay}s infinite`;

      particles.appendChild(particle);

      // Remove particle after animation to avoid memory issues
      setTimeout(
        () => {
          if (particles.contains(particle)) {
            particles.removeChild(particle);
          }
        },
        (duration + delay) * 1000,
      );
    };

    // Create initial set of particles
    for (let i = 0; i < 15; i++) {
      createParticle();
    }

    // Create particles periodically
    const interval = setInterval(createParticle, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`min-h-screen bg-[#0d0f17] text-white overflow-x-hidden relative transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#151824] via-[#0d0f17] to-[#0d0f17] z-0"></div>

      {/* Radial glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[600px] sm:h-[800px] bg-[#87efac]/5 blur-[100px] rounded-full opacity-50 z-0"></div>

      {/* Animated particles */}
      <div
        id="particles"
        className="absolute inset-0 z-0 overflow-hidden"
      ></div>

      {/* Content */}
      <div className="relative z-10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HomeHeader />

          <main className="flex flex-col">
            <HomeHero />
            <HomeTrendingCoins />
            <HomeCta />
          </main>

          <HomeFooter />
        </div>
      </div>

      {/* Floating animation keyframes */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          10% {
            opacity: var(--opacity, 0.2);
          }
          90% {
            opacity: var(--opacity, 0.2);
          }
          100% {
            transform: translateY(calc(100vh + 30px));
            opacity: 0;
          }
        }

        /* Add responsive adjustments */
        @media (max-width: 640px) {
          #particles {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
