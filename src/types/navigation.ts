export interface NavItem {
  name: string;
  href: string;
  onClick?: () => void;
}

export interface SocialIconsProps {
  isMobile?: boolean;
}


export interface DesktopNavigationProps {
  navItems: NavItem[];
  isConnected: boolean;
  onConnectWallet: () => void;
  onClickHelp?: () => void;
}

export interface MobileNavigationProps {
  isOpen: boolean;
  toggleMenu: () => void;
  navItems: NavItem[];
  isConnected: boolean;
  onConnectWallet: () => void;
}

export interface ConnectButtonProps {
  isConnected: boolean;
  onConnect: () => void;
} 