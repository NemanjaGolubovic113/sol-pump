import './globals.css';
import type { Metadata } from 'next';
import { Space_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { WalletProvider } from '@/providers/wallet-provider';

const mono = Space_Mono({ 
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

let title = 'CopyMeme - Copy Trending Meme Coins in 1 Click';
let description =
  'Copy the latest trending coins from Pump.fun in 1 click and deploy them on Raydium before the community does.';
let url = 'https://www.copymeme.com';
let ogimage = 'https://www.copymeme.com/og-image.png';
let sitename = 'copymeme.com';

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    images: [ogimage],
    title,
    description,
    url: url,
    siteName: sitename,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    images: [ogimage],
    title,
    description,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: '#1b1d28',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${mono.variable} scroll-smooth`}>
      <body className="font-mono bg-[#1b1d28] text-white min-h-screen overflow-x-hidden antialiased">
        <WalletProvider>
          <main className="flex flex-col min-h-screen">{children}</main>
          <Analytics />
        </WalletProvider>
      </body>
    </html>
  );
}
