'use client';

import Link from 'next/link';
import { Heart, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import FaqModal from './faq-modal';
import TermsModal from './terms-modal';

// Custom X (Twitter) Icon
const XTwitterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M18.205 2.25h3.308l-7.227 8.26l8.502 11.24H16.13l-5.214-6.817L4.95 21.75H1.64l7.73-8.835L1.215 2.25H8.04l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z"
    />
  </svg>
);

// Custom YouTube Icon
const YouTubeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
    />
  </svg>
);

export default function HomeFooter() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [isVisible, setIsVisible] = useState(false);
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [termsModal, setTermsModal] = useState<{
    isOpen: boolean;
    type: 'terms' | 'privacy' | 'disclaimer';
  }>({
    isOpen: false,
    type: 'terms',
  });

  // Update year if needed
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  // Fade-in animation on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Open terms modal with specific type
  const openTermsModal = (type: 'terms' | 'privacy' | 'disclaimer') => {
    setTermsModal({
      isOpen: true,
      type,
    });
  };

  // Close terms modal
  const closeTermsModal = () => {
    setTermsModal((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  // Social links with hover color effects
  const socialLinks = [
    {
      name: 'Twitter',
      url: 'https://x.com',
      icon: <XTwitterIcon />,
      color: 'text-white hover:text-[#87efac]',
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com',
      icon: <YouTubeIcon />,
      color: 'text-[#FF0000] hover:text-[#87efac]',
    },
  ];

  return (
    <>
      <footer
        className={`py-8 md:py-12 border-t border-[#87efac]/20 relative ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}
      >
        {/* Background subtle glow matching other sections */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#87efac]/5 rounded-full blur-[80px] opacity-50 z-0"></div>

        {/* Content */}
        <div className="relative z-10 container max-w-4xl mx-auto px-4 sm:px-6 text-center">
          {/* Logo */}
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center">
              <div className="bg-[#87efac]/10 p-1.5 rounded-lg mr-2">
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

            <p className="text-sm text-gray-400 mt-3 max-w-md mx-auto">
              The #1 tool to copy and deploy trending meme coins from Pump.fun
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <button
              onClick={() => openTermsModal('terms')}
              className="text-gray-400 hover:text-[#87efac] text-sm transition-colors"
            >
              Terms
            </button>
            <button
              onClick={() => openTermsModal('privacy')}
              className="text-gray-400 hover:text-[#87efac] text-sm transition-colors"
            >
              Privacy
            </button>
            <button
              onClick={() => openTermsModal('disclaimer')}
              className="text-gray-400 hover:text-[#87efac] text-sm transition-colors"
            >
              Disclaimer
            </button>
            <button
              onClick={() => setFaqModalOpen(true)}
              className="text-gray-400 hover:text-[#87efac] text-sm transition-colors"
            >
              Help & FAQ
            </button>
          </div>

          {/* Social links */}
          <div className="flex justify-center gap-4 mb-8">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${item.color} flex items-center justify-center w-8 h-8 rounded-full bg-[#1b1d28] hover:bg-[#1b1d28]/80`}
                title={item.name}
                aria-label={item.name}
              >
                {item.icon}
              </a>
            ))}
          </div>

          {/* Copyright section */}
          <div className="border-t border-[#87efac]/10 pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="text-xs text-gray-500 flex items-center">
              <Heart className="inline h-3 w-3 text-[#ebb305] mr-1.5" />
              <span>Built by degens, for degens</span>
            </div>
            <div className="text-xs text-gray-500">
              &copy; {year} CopyMeme. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <FaqModal isOpen={faqModalOpen} onClose={() => setFaqModalOpen(false)} />
      <TermsModal
        isOpen={termsModal.isOpen}
        onClose={closeTermsModal}
        type={termsModal.type}
      />
    </>
  );
}
