import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import AuthSessionProvider from "@/providers/AuthSessionProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "QuickChat",
  description: "QuickChat - Chat with your friends and family.",
};

export default function RootLayout({
  children, //
}: Readonly<{ //  "Once these props are passed in, they cannot be changed.
  children: React.ReactNode; // This defines the Type of children
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthSessionProvider>
            {children}
        </AuthSessionProvider>
      </body>
    </html>
  );
}
