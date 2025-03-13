import type { Metadata, Viewport } from "next";
import "./globals.css";
import NavBar from "./components/NavBar";
import AuthProvider from "./contexts/AuthContext";
import { TournamentProvider } from "./contexts/TournamentContext";
import TournamentSelector from "@/components/TournamentSelector";
import { Suspense } from "react";
import MatchWithStatsProvider from "./contexts/MatchWithStatsContext";
import DraftMatchProvider from "./contexts/DraftMatchContext";

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
      <body className={`antialiased bg-[#0B2818]`}>
        <Suspense fallback={<div>Loading...</div>}>
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
