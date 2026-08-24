import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import type { ReactNode } from "react";

import { env } from "@/config/env";
import { GoogleAuthProvider } from "@/providers/GoogleAuthProvider";
import { QueryProvider } from "@/providers/query-provider";
import { ToastProvider } from "@/providers/ToastProvider";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Cricket",
    template: "%s | Cricket",
  },
  description:
    "Cricket management app for players, teams, matches, scorecards, and ball-by-ball records.",
  applicationName: "Cricket",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Cricket",
    description:
      "Manage cricket players, teams, matches, scorecards, and ball-by-ball records.",
    type: "website",
    locale: "en_IN",
    siteName: "Cricket",
  },
  robots: {
    index: true,
    follow: true,
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en-IN" className={poppins.variable}>
      <body className={`${poppins.className} antialiased`}>
        <GoogleAuthProvider clientId={env.GOOGLE_CLIENT_ID}>
          <QueryProvider>
            <ToastProvider>{children}</ToastProvider>
          </QueryProvider>
        </GoogleAuthProvider>
      </body>
    </html>
  );
}
