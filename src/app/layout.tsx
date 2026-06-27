import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = "https://zeelshah.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Zeel Shah — AI/ML Engineer | LLM Systems | MLOps",
    template: "%s | Zeel Shah",
  },
  description:
    "AI/ML Engineer building intelligent systems that transform data into decisions. Expertise in LLM systems, MLOps, model training, and backend development.",
  keywords: [
    "AI Engineer",
    "ML Engineer",
    "LLM Systems",
    "MLOps",
    "Backend Developer",
    "PyTorch",
    "FastAPI",
    "Zeel Shah",
  ],
  authors: [{ name: "Zeel Shah" }],
  creator: "Zeel Shah",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Zeel Shah — AI/ML Engineer",
    description:
      "Building intelligent systems that transform data into decisions.",
    siteName: "Zeel Shah Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zeel Shah — AI/ML Engineer",
    description:
      "Building intelligent systems that transform data into decisions.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050816",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="antialiased bg-background text-gray-200 selection:bg-primary/30">
        {children}
      </body>
    </html>
  );
}
