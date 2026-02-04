import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hello Saanvika — A quiet journal of beginnings",
  description:
    "A personal digital journal preserving childhood moments, memories, and words written with love.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-white text-neutral-900`}
      >
        <div className="min-h-screen flex justify-center">
          <div className="w-full max-w-5xl px-6">
            
            {/* Quiet home anchor */}
            <header className="site-header">
              <Link href="/" className="site-title">
                Hello Saanvika
              </Link>
            </header>

            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
