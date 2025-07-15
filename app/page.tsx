import { Metadata } from "next";
import ClientHomePage from "@/components/ClientHomePage";
import CookieConsentBanner from '@/components/CookieConsentBanner';

export const metadata: Metadata = {
  title: "BQI Tech - Custom Software Development & IT Solutions",
  description: "BQI Tech offers custom software development, DevOps consultancy, and IT solutions for governments. Partner with top offshore software development experts today!",
};

export default function Home() {
  return (
    <main>
      <ClientHomePage />
      <CookieConsentBanner />
    </main>
  );
}


