import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PremiumBackground } from "@/components/layout/premium-background";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { VisitorTracker } from "@/components/layout/visitor-tracker";
import { Toaster } from "@/components/ui/toast";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Bizimana Fils | EV Technician & Innovator — Kigali, Rwanda",
    template: "%s | Bizimana Fils",
  },
  description:
    "Personal portfolio and innovation platform by Bizimana Fils — Electrical Vehicle Technician, AI Enthusiast, and Technology Researcher from Kigali, Rwanda.",
  keywords: [
    "Bizimana Fils",
    "Rwanda",
    "EV Technician",
    "Automobile Technology",
    "AI",
    "Kigali",
    "Portfolio",
    "Innovation",
    "Electric Vehicle",
    "Technology",
  ],
  authors: [{ name: "Bizimana Fils" }],
  openGraph: {
    title: "Bizimana Fils — EV Technician & Innovation Technologist",
    description: "Innovating at the Intersection of Technology & African Ingenuity",
    locale: "en_US",
    siteName: "Bizimana Fils",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-dark-950 antialiased">
        <PremiumBackground />
        <Navbar />
        <main className="relative z-10 min-h-screen">{children}</main>
        <Footer />
        <ScrollToTop />
        <VisitorTracker />
        <Toaster />
      </body>
    </html>
  );
}
