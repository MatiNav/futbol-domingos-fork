import { Suspense } from "react";
import type { Metadata, Viewport } from "next";

import "./globals.css";

import AuthProvider from "./contexts/AuthContext";
import { TournamentProvider } from "./contexts/TournamentContext";
import DraftMatchProvider from "./contexts/DraftMatchContext";
import MatchWithStatsProvider from "./contexts/MatchWithStatsContext";
import NavBar from "@/app/components/NavBar";
import TournamentSelector from "@/components/TournamentSelector";
import Spinner from "@/app/components/spinner";

export const metadata: Metadata = {
  title: "Futbol",
  description: "Clausura 2025",
  manifest: "/manifest.json",
  icons: {
    apple: "/icon512_maskable.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manufacturing+Consent&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`antialiased bg-[#0B2818]`}>
        <Suspense fallback={<Spinner />}>
          <AuthProvider>
            <TournamentProvider>
              <MatchWithStatsProvider>
                <DraftMatchProvider>
                  <NavBar />
                  <TournamentSelector />
                  {children}
                </DraftMatchProvider>
              </MatchWithStatsProvider>
            </TournamentProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
