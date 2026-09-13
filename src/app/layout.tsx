import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#090d16' },
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'Aura AI — Your Personal AI Friend, Companion & Guide',
  description:
    'A modern, emotionally intelligent AI companion with persistent personal memory, real-time mood awareness, singing & music composition, and hands-free voice interaction.',
  applicationName: 'Aura AI',
  authors: [{ name: 'Varun Sharma', url: 'https://github.com/varunnshhh-ux' }],
  keywords: [
    'AI Companion',
    'AI Friend',
    'Chatbot',
    'Next.js 15',
    'React 19',
    'Emotional AI',
    'Voice AI',
    'AI Memory',
    'Gemini AI',
    'Singing AI',
  ],
  creator: 'Varun Sharma',
  publisher: 'Aura AI',
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://github.com/varunnshhh-ux/ai-friend-chatbot',
    siteName: 'Aura AI',
    title: 'Aura AI — Your Personal AI Friend, Companion & Guide',
    description:
      'A warm, empathetic AI friend and guide with long-term memory, mood detection, singing mode, and voice conversation.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Aura AI Companion & Friend',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aura AI — Your Personal AI Friend, Companion & Guide',
    description:
      'An emotionally aware AI companion with long-term memory, voice interaction, and music generation.',
    creator: '@varunsharma',
    images: ['/og-image.png'],
  },
  appleWebApp: {
    capable: true,
    title: 'Aura AI',
    statusBarStyle: 'black-translucent',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-zinc-950 text-zinc-100 min-h-screen selection:bg-indigo-500/30 selection:text-indigo-200">
        <div id="__next">{children}</div>
      </body>
    </html>
  );
}
