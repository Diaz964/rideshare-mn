import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "XELAJU",
  description: "Book affordable rides with XELAJU",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="bg-burgundy text-white">
          <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              XELAJU
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-medium text-burgundy-100 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                href="/admin"
                className="text-sm font-medium text-burgundy-100 hover:text-white transition-colors"
              >
                Admin
              </Link>
              <Link
                href="/book"
                className="text-sm font-medium bg-white text-burgundy px-4 py-2 rounded-full hover:bg-burgundy-50 transition-colors"
              >
                Book a Ride
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-burgundy-900 text-burgundy-200 py-8">
          <div className="max-w-6xl mx-auto px-6 text-center text-sm">
            &copy; {new Date().getFullYear()} XELAJU. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
