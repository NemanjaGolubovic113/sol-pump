'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X as CloseIcon } from 'lucide-react';
import { TermsModalProps } from '@/types/modals';

export default function TermsModal({ isOpen, onClose, type }: TermsModalProps) {
  const [visible, setVisible] = useState(false);

  // Handle modal visibility
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

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Get title based on type
  const getTitle = () => {
    switch (type) {
      case 'terms':
        return 'Terms of Service';
      case 'privacy':
        return 'Privacy Policy';
      case 'disclaimer':
        return 'Disclaimer';
      default:
        return 'Legal Information';
    }
  };

  // Get content based on type
  const getContent = () => {
    switch (type) {
      case 'terms':
        return (
          <div className="space-y-4 text-sm">
            <p>Welcome to CopyMeme. By accessing our platform, you agree to these terms.</p>
            <p>CopyMeme provides a service that allows users to deploy meme tokens. We do not guarantee the success or value of any deployed tokens.</p>
            <p>You must be 18 years or older to use our service. You are responsible for maintaining the security of your wallet and all activities that occur through your account.</p>
            <p>We reserve the right to modify these terms at any time. Your continued use of the platform after such changes constitutes acceptance of the new terms.</p>
          </div>
        );
      case 'privacy':
        return (
          <div className="space-y-4 text-sm">
            <p>CopyMeme respects your privacy. This policy explains how we collect, use, and protect your data.</p>
            <p>We collect wallet addresses, transaction history on our platform, and usage statistics. We do not collect personally identifiable information.</p>
            <p>Your data is used to improve our services, process transactions, and provide support. We do not sell your data to third parties.</p>
            <p>We employ industry-standard security measures to protect your data, but no method of transmission over the internet is 100% secure.</p>
          </div>
        );
      case 'disclaimer':
        return (
          <div className="space-y-4 text-sm">
            <p>CopyMeme is an experimental platform for meme token deployment. Use at your own risk.</p>
            <p>Cryptocurrency investments are highly speculative and volatile. You should never invest more than you can afford to lose.</p>
            <p>The information provided on this platform does not constitute investment advice, financial advice, trading advice, or any other sort of advice.</p>
            <p>We are not responsible for any losses you may incur as a result of using our platform or deploying tokens.</p>
          </div>
        );
      default:
        return <p>No content available.</p>;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-4 ${
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        } transition-all duration-300 z-[101]`}
      >
        <div className="relative w-full max-h-[85vh] bg-[#0d0f17] rounded-xl border border-zinc-800 overflow-hidden shadow-2xl flex flex-col">
          <div className="bg-[#1b1d28] p-4 flex items-center justify-between sticky top-0 z-10">
            <h2 className="text-lg font-bold text-white">{getTitle()}</h2>
            <button
              className="p-1 text-zinc-400 hover:text-white transition-colors"
              onClick={onClose}
              aria-label="Close"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="overflow-y-auto p-4 sm:p-6 text-zinc-300">{getContent()}</div>

          <div className="border-t border-zinc-800 p-4 bg-[#1b1d28] sticky bottom-0">
            <Button
              className="w-full bg-[#87efac] hover:bg-[#87efac]/90 text-[#0d0f17] font-bold"
              onClick={onClose}
            >
              I Understand
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
