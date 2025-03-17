export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface DeploySuccessModalProps extends BaseModalProps {
  tokenData: {
    name: string;
    symbol: string;
    contractAddress: string;
  };
  onCreatePool?: () => void;
}

export interface VideoModalProps extends BaseModalProps {
  videoId: string; // YouTube video ID
}

export interface TermsModalProps extends BaseModalProps {
  type: 'terms' | 'privacy' | 'disclaimer';
}

export type FaqItem = {
  question: string;
  answer: string;
};

export interface FaqModalProps extends BaseModalProps {} 