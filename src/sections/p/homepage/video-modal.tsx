'use client';

import { useState, useEffect, useRef } from 'react';
import { X as CloseIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VideoModalProps } from '@/types/modals';

export default function VideoModal({ isOpen, onClose, videoId }: VideoModalProps) {
  const [visible, setVisible] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
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
  
  // Stop YouTube video when closing modal
  const handleClose = () => {
    if (iframeRef.current) {
      // This will pause the YouTube video
      iframeRef.current.src = iframeRef.current.src;
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto overflow-x-hidden p-4">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      ></div>
      
      {/* Modal */}
      <div 
        className={`relative w-full max-w-4xl max-h-[90vh] overflow-hidden transition-all duration-300 transform ${
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {/* Close button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="absolute top-2 right-2 z-10 text-white hover:text-white bg-black/50 hover:bg-black/70 p-1.5 rounded-full focus:outline-none" 
          onClick={handleClose}
          aria-label="Close video"
        >
          <CloseIcon className="h-5 w-5" />
        </Button>
        
        {/* Video container with 16:9 aspect ratio */}
        <div className="relative w-full pb-[56.25%] overflow-hidden rounded-lg shadow-2xl bg-black">
          <iframe
            ref={iframeRef}
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
} 