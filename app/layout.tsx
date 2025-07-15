"use client";
import { Inter } from "next/font/google"
import ClientWrapper from './ClientWrapper'
import "./globals.css"
import { ReactNode, useEffect } from 'react'
import { metadata } from './metadata'
import { usePathname } from 'next/navigation'
import { Toaster } from "react-hot-toast"
import { Toaster as SonnerToaster } from 'sonner'
import { Providers } from './providers'
import Script from 'next/script'

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  useEffect(() => {
    // Dynamically load ThinkStack AI script
    const script = document.createElement('script');
    script.src = 'https://app.thinkstack.ai/bot/thinkstackai-loader.min.js';
    script.setAttribute('chatbot_id', '67334193bde936bef06b2d4a');
    script.setAttribute('data-type', 'default');
    script.async = true;
    
    // Add error handling
    script.onerror = () => {
      console.error('Failed to load ThinkStack AI script');
    };

    document.head.appendChild(script);

    // Load the icon separately
    const iconScript = document.createElement('script');
    iconScript.src = 'https://api.thinkstack.ai/api/v1/chatbot/icon/67334193bde936bef06b2d4a?type=default';
    iconScript.async = true;
    iconScript.onerror = () => {
      console.error('Failed to load ThinkStack AI icon');
    };
    document.head.appendChild(iconScript);

    return () => {
      document.head.removeChild(script);
      document.head.removeChild(iconScript);
    };
  }, []);

  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        <link 
          rel="preload" 
          href="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" 
          as="script"
        />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <ClientWrapper>
            {children}
          </ClientWrapper>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}

