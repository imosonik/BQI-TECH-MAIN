"use client";
import { Inter } from "next/font/google"
import ClientWrapper from './ClientWrapper'
import "./globals.css"
import { ReactNode } from 'react'
import { metadata } from './metadata'
import { usePathname } from 'next/navigation'
import { Toaster } from "react-hot-toast"
import { Toaster as SonnerToaster } from 'sonner'
import { Providers } from './providers'
import Script, { ScriptProps } from 'next/script'

// Extend ScriptProps to include custom attributes
interface CustomScriptProps extends ScriptProps {
  'chatbot_id'?: string;
  'data-type'?: string;
}

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        <link 
          rel="preload" 
          href="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" 
          as="script"
        />
        <meta name="color-scheme" content="light dark" />
        <Script
          id="thinkstack-chatbot"
          strategy="lazyOnload"
          src="https://app.thinkstack.ai/bot/thinkstackai-loader.min.js"
          data-type="default"
          chatbot_id="67334193bde936bef06b2d4a"
          {...{
            'data-type': 'default',
            'chatbot_id': '67334193bde936bef06b2d4a'
          } as CustomScriptProps}
        />
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

