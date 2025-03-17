'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, X as CloseIcon, Zap } from 'lucide-react';
import { FaqItem, FaqModalProps } from '@/types/modals';

export default function FaqModal({ isOpen, onClose }: FaqModalProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);

  // Handle modal animation
  useEffect(() => {
    if (isOpen) {
      // Short delay to trigger animation
      const timer = setTimeout(() => {
        setVisible(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  // Close modal on escape key
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

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqItems: FaqItem[] = [
    {
      question: 'What is CopyMeme?',
      answer:
        'CopyMeme is a platform that allows you to discover trending meme coins from Pump.fun and deploy them on Raydium with a single click. Our tool helps you stay ahead of the market by providing a streamlined way to copy and deploy trending tokens.',
    },
    {
      question: 'How does the copying process work?',
      answer:
        "When you click the 'Copy' button on a trending token, our platform automatically fetches the token's contract code, optimizes it for deployment on Raydium, and prepares everything needed for a successful launch. You just need to approve the transaction and our platform handles the rest.",
    },
    {
      question: 'Is there a fee for using CopyMeme?',
      answer:
        'CopyMeme charges a small fee of 0.2 SOL per token deployment to cover operational costs and development.',
    },
    {
      question: 'How do you determine which coins are trending?',
      answer:
        'We use a combination of data sources, including Pump.fun engagement metrics, social media activity, and trading volume to determine which coins are trending. Our system refreshes regularly to ensure you always see the latest trending tokens.',
    },
    {
      question: 'What happens after I deploy a token?',
      answer:
        "After successful deployment, you'll receive the contract address of your newly created token. You can then add liquidity, start marketing your token, and build your community. Remember that successful meme coins require active community building beyond just token creation.",
    },
    {
      question: 'Can I deploy multiple tokens?',
      answer:
        'Yes! You can deploy as many tokens as you want. Each deployment is a separate transaction on the blockchain. We encourage experimentation, but remember that building a successful community around your token requires dedication and effort.',
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop with blur */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal container */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl p-4 ${
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        } transition-all duration-300 z-[101]`}
      >
        {/* Modal content */}
        <div className="relative w-full max-h-[85vh] bg-[#0d0f17] rounded-xl border border-zinc-800 overflow-hidden shadow-2xl flex flex-col">
          {/* Header */}
          <div className="bg-[#1b1d28] p-4 flex items-center justify-between sticky top-0 z-10">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Zap className="w-5 h-5 mr-2 text-[#87efac]" />
              Help & FAQ
            </h2>
            <button
              className="p-1 text-zinc-400 hover:text-white transition-colors"
              onClick={onClose}
              aria-label="Close"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          {/* FAQ Content - Scrollable */}
          <div className="overflow-y-auto p-4 sm:p-6">
            <div className="space-y-3">
              {faqItems.map((faq, index) => (
                <div
                  key={index}
                  className="border border-zinc-800 rounded-lg overflow-hidden"
                >
                  <button
                    className={`w-full text-left p-4 flex justify-between items-center transition-colors ${
                      openIndex === index
                        ? 'bg-[#87efac]/10 text-[#87efac]'
                        : 'bg-[#1b1d28] text-white hover:bg-[#1b1d28]/80'
                    }`}
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="font-medium">{faq.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openIndex === index ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    <div className="p-4 text-zinc-300 bg-[#0d0f17]">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-zinc-800 p-4 bg-[#1b1d28] sticky bottom-0">
            <Button
              className="w-full bg-[#87efac] hover:bg-[#87efac]/90 text-[#0d0f17] font-bold"
              onClick={onClose}
            >
              Got It
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
