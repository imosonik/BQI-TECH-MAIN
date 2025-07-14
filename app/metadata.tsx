import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Government Software & Digital Transformation | BQI Tech",
  description: "BQI Tech delivers secure, scalable software solutions for government agencies, accelerating digital transformation with custom built technologies.",
  metadataBase: new URL("https://www.bqitech.com"),
  alternates: {
    canonical: "/",
  },
  keywords: ['custom software development', 'IT solutions', 'DevOps consultancy', 'government software', 'offshore development'],
  authors: [{ name: 'BQI Tech' }],
  creator: 'BQI Tech',
  publisher: 'BQI Tech',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bqitech.com',
    siteName: 'BQITech',
    title: 'Secure Government Software & Digital Transformation | BQI Tech',
    description: 'BQI Tech delivers secure, scalable software solutions for government agencies, accelerating digital transformation with custom built technologies.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BQI Tech - Secure Government Software & Digital Transformation',
        type: 'image/jpeg',
      },
    ],
  },
  other: {
    'canonical': '<link rel="canonical" href="https://www.bqitech.com/" />'
  }
};

