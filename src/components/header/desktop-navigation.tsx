import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

export interface NavItem {
  name: string;
  href: string;
  onClick: () => void;
}

interface DesktopNavigationProps {
  navItems: NavItem[];
  onClickHelp: () => void;
}

const DesktopNavigationComponent: React.FC<DesktopNavigationProps> = ({ 
  navItems,
  onClickHelp
}) => {
  return (
    <>
      {/* Desktop navigation */}
      <nav className="hidden md:flex items-center space-x-6">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            onClick={item.onClick}
            className="text-gray-300 hover:text-[#87efac] transition-colors text-sm font-medium"
          >
            {item.name}
          </a>
        ))}
      </nav>

      {/* Help button - Medium screens only */}
      <Button
        variant="ghost"
        size="sm"
        className="hidden sm:flex md:hidden text-white hover:text-[#87efac] hover:bg-[#87efac]/10 p-1.5"
        onClick={onClickHelp}
        title="FAQs"
      >
        <HelpCircle className="h-4 w-4" />
      </Button>
    </>
  );
};

export const DesktopNavigation = memo(DesktopNavigationComponent); 