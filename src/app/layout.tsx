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
      <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `if(location.protocol==='http:'&&location.hostname!=='localhost'){location.replace('https://'+location.host+location.pathname+location.search+location.hash);}`,
            }}
          />
        </head>
      <body className="min-h-full flex flex-col">
        <header className="bg-burgundy text-white">
          <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              XELAJU
            </Link>
            <div className="flex items-center gap-4 sm:gap-6">
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
          <div className="max-w-6xl mx-auto px-6 text-center text-sm space-y-3">
            <div>
              <Link
                href="/drive"
                className="inline-block bg-white text-burgundy-900 font-semibold px-6 py-2 rounded-full hover:bg-burgundy-50 transition-colors"
              >
                Drive with Us — Apply Now
              </Link>
            </div>
            <div>
              <a
                href="tel:6125582880"
                className="text-burgundy-100 hover:text-white transition-colors font-medium"
              >
                📞 (612) 558-2880
              </a>
              <span className="mx-2">·</span>
              <span>Book by phone 24/7</span>
            </div>
            <div>
              &copy; {new Date().getFullYear()} XELAJU. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
