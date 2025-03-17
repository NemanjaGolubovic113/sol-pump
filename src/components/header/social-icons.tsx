import React, { memo } from 'react';

// Custom X (Twitter) Icon
export const XTwitterIcon = () => (
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
export const YouTubeIcon = () => (
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

interface SocialIconsProps {
  isMobile?: boolean;
}

const SocialIconsComponent: React.FC<SocialIconsProps> = ({ isMobile }) => {
  if (isMobile) {
    return (
      <div className="flex items-center justify-between">
        {/* X Icon in mobile menu */}
        <a
          href="https://x.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-white hover:text-gray-200 px-3 py-3 rounded-md hover:bg-black/10 transition-all duration-300 text-sm font-mono"
        >
          <XTwitterIcon />
          <span className="ml-2">X (Twitter)</span>
        </a>

        {/* YouTube Icon in mobile menu */}
        <a
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-[#FF0000] hover:text-[#FF0000]/80 px-3 py-3 rounded-md hover:bg-[#FF0000]/10 transition-all duration-300 text-sm font-mono"
        >
          <YouTubeIcon />
          <span className="ml-2">YouTube</span>
        </a>
      </div>
    );
  }

  return (
    <>
      {/* X (Twitter) Icon */}
      <a
        href="https://x.com"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:flex text-white hover:text-white bg-black/30 p-1.5 rounded-lg transition-all duration-300 hover:bg-black/50 transform hover:rotate-12"
        title="Follow us on X"
        aria-label="X (Twitter)"
      >
        <XTwitterIcon />
      </a>

      {/* YouTube Icon */}
      <a
        href="https://youtube.com"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:flex text-[#FF0000] hover:text-white bg-[#FF0000]/10 p-1.5 rounded-lg transition-all duration-300 hover:bg-[#FF0000]/20 transform hover:rotate-12"
        title="Subscribe on YouTube"
        aria-label="YouTube"
      >
        <YouTubeIcon />
      </a>
    </>
  );
};

export const SocialIcons = memo(SocialIconsComponent); 