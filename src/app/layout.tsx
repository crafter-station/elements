import type { Metadata } from "next";
import { Doto, Figtree, JetBrains_Mono } from "next/font/google";

import { ThemeProvider } from "next-themes";

import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/themes";
import { Analytics } from "@vercel/analytics/next";

import { Toaster } from "@/components/ui/sonner";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const doto = Doto({
  variable: "--font-doto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tryelements.dev"),
  title: {
    default: "Elements - Full Stack Components by Crafter Station",
    template: "%s | Elements",
  },
  description:
    "Production-ready full stack components for modern web applications. Built with React, TypeScript, and Tailwind CSS. Easy to install, customize, and integrate.",
  keywords: [
    "react components",
    "full stack components",
    "tailwind css",
    "typescript",
    "shadcn",
    "ui components",
    "authentication",
    "clerk",
    "stripe",
    "next.js components",
  ],
  authors: [
    {
      name: "Railly Hugo",
      url: "https://github.com/Railly",
    },
  ],
  creator: "Railly Hugo",
  publisher: "Railly Hugo",
  applicationName: "Elements",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tryelements.dev",
    title: "Elements - Full Stack Components by Railly Hugo",
    description:
      "Production-ready full stack components for modern web applications. Built with React, TypeScript, and Tailwind CSS.",
    siteName: "Elements",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elements - Full Stack Components by Railly Hugo",
    description:
      "Production-ready full stack components for modern web applications. Built with React, TypeScript, and Tailwind CSS.",
    creator: "@raillyhugo",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        theme: shadcn,
        elements: {
          modalBackdrop: "bg-black/50",
          modalContent: "flex items-center justify-center !my-auto",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${figtree.variable} ${jetbrainsMono.variable} ${doto.variable} font-sans antialiased selection:bg-[#FFF4ED] selection:text-[#D97535] dark:selection:bg-[#2B1A0F] dark:selection:text-[#FFC79A]`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          <Analytics />
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
