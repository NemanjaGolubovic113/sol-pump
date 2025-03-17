'use client';

import { useState, useEffect } from 'react';
import { NavItem, DesktopNavigation } from '@/components/header/desktop-navigation';
import { MobileNavigation } from '@/components/header/mobile-navigation';
import { Logo } from '@/components/header/logo';
import { SocialIcons } from '@/components/header/social-icons';
import { ConnectButton } from '@/components/header/connect-button';
import FaqModal from './faq-modal';

export default function HomeHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Kullanıcı ile birlikte header hareket etmeli
      // Show/hide header based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Aşağı scroll - Header görünür kalmalı
        setHeaderVisible(true);
      } else {
        // Yukarı scroll - Header görünür kalmalı
        setHeaderVisible(true);
      }
      
      // Update last scroll position
      setLastScrollY(currentScrollY);
      
      // Apply background once we scroll a bit
      if (currentScrollY > 10 && !scrolled) {
        setScrolled(true);
      } else if (currentScrollY <= 10 && scrolled) {
        setScrolled(false);
      }
    };

    // Apply initial animation
    setMounted(true);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled, lastScrollY]);

  // Close mobile menu when clicking a link
  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  // Handle window resize - close mobile menu on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Open FAQ modal
  const openFaqModal = () => {
    setFaqModalOpen(true);
    setMobileMenuOpen(false); // Close mobile menu if open
  };

  // Handle wallet connection
  const handleConnect = () => {
    // In a real app, this would trigger a wallet connection dialog
    setIsConnected(!isConnected);
  };

  // Navigation items with clear, action-oriented labels
  const navItems: NavItem[] = [
    { name: 'Explore Coins', href: '#trending-coins', onClick: handleNavClick },
    { name: 'Help & FAQ', href: '#', onClick: openFaqModal },
  ];

  return (
    <>
      <header
        className={`py-4 z-50 sticky transition-all duration-300 ${
          scrolled
            ? 'bg-[#0d0f17]/90 backdrop-blur-lg shadow-lg'
            : 'bg-transparent'
        } ${
          headerVisible ? 'top-0' : '-top-full'
        } ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            {/* Logo component */}
            <Logo />

            {/* Desktop Navigation */}
            <DesktopNavigation 
              navItems={navItems}
              onClickHelp={openFaqModal}
            />

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              {/* Social Icons */}
              <SocialIcons />

              {/* Connect Wallet Button */}
              <ConnectButton 
                isConnected={isConnected}
                onConnect={handleConnect}
              />

              {/* Mobile Navigation */}
              <MobileNavigation 
                isOpen={mobileMenuOpen}
                toggleMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
                navItems={navItems}
                isConnected={isConnected}
                onConnectWallet={handleConnect}
              />
            </div>
          </div>
        </div>
      </header>

      {/* FAQ Modal */}
      <FaqModal isOpen={faqModalOpen} onClose={() => setFaqModalOpen(false)} />
    </>
  );
}
