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
  title: "Elements",
  description: "Full Stack Components by Crafter Station",
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
          className={`${figtree.variable} ${jetbrainsMono.variable} ${doto.variable} font-sans antialiased selection:bg-foreground selection:text-background`}
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
