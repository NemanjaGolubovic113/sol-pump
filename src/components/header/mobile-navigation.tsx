import React, { memo, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Menu, X as XIcon, Wallet, Check } from 'lucide-react';
import { SocialIcons } from './social-icons';
import { NavItem } from './desktop-navigation';

interface MobileNavigationProps {
  isOpen: boolean;
  toggleMenu: () => void;
  navItems: NavItem[];
  isConnected: boolean;
  onConnectWallet: () => void;
}

const MobileMenuButton: React.FC<{ isOpen: boolean; toggleMenu: () => void }> = ({ isOpen, toggleMenu }) => (
  <Button
    variant="ghost"
    size="sm"
    className="md:hidden p-1.5 text-white hover:bg-white/10"
    onClick={toggleMenu}
    aria-label={isOpen ? 'Close menu' : 'Open menu'}
  >
    {isOpen ? <XIcon className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
  </Button>
);

const MobileMenuPanel: React.FC<{
  isOpen: boolean;
  navItems: NavItem[];
  isConnected: boolean;
  onConnectWallet: () => void;
  onClickOutside: () => void;
}> = ({ isOpen, navItems, isConnected, onConnectWallet, onClickOutside }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Tıklama olaylarını dinle
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      // Mobil menü dışına tıklandığında menüyü kapat
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClickOutside();
      }
    };

    // Sadece menü açıkken dinlemeye başla
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClickOutside]);
  
  if (!isOpen) return null;
  
  return (
    <>
      {/* Overlay for click outside - helps with touch events */}
      <div 
        className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClickOutside}
        aria-hidden="true"
      />
      
      {/* Menu panel */}
      <div
        className="md:hidden fixed inset-x-0 top-[72px] z-50 pt-2 pointer-events-auto"
        aria-hidden={!isOpen}
      >
        <div 
          ref={menuRef}
          className="mx-4 rounded-xl bg-[#151824] border border-[#87efac]/10 shadow-lg shadow-black/20 backdrop-blur-lg"
        >
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={item.onClick}
                className="flex items-center justify-between text-white hover:text-[#87efac] font-medium font-mono text-sm px-3 py-3 rounded-md hover:bg-[#87efac]/5 transition-all duration-300"
              >
                {item.name}
                <ChevronRight className="h-4 w-4 opacity-50" />
              </button>
            ))}
            <div className="pt-2 mt-2 border-t border-[#87efac]/10">
              <SocialIcons isMobile={true} />

              <div className="mt-2 p-3 flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  className={`w-full flex items-center justify-center px-4 py-2 h-auto border-[#87efac]/40 text-[#87efac] hover:text-[#87efac] hover:bg-[#87efac]/10 text-sm font-mono transition-all duration-300 ${isConnected ? 'bg-[#87efac]/10' : ''}`}
                  onClick={onConnectWallet}
                >
                  {isConnected ? (
                    <>
                      <Check className="mr-1.5 h-3.5 w-3.5" />
                      <span>Connected</span>
                    </>
                  ) : (
                    <>
                      <Wallet className="mr-1.5 h-3.5 w-3.5" />
                      <span>Connect Wallet</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

const MobileNavigationComponent: React.FC<MobileNavigationProps> = ({
  isOpen,
  toggleMenu,
  navItems,
  isConnected,
  onConnectWallet,
}) => {
  return (
    <>
      <MobileMenuButton isOpen={isOpen} toggleMenu={toggleMenu} />
      <MobileMenuPanel 
        isOpen={isOpen} 
        navItems={navItems} 
        isConnected={isConnected} 
        onConnectWallet={onConnectWallet}
        onClickOutside={toggleMenu}
      />
    </>
  );
};

export const MobileNavigation = memo(MobileNavigationComponent); 