import type { Metadata, Viewport } from "next";
import "./globals.css";
import NavBar from "./components/NavBar";
import AuthProvider from "./providers/AuthProvider";
import { TournamentProvider } from "./contexts/TournamentContext";
import { getTournaments } from "./features/tournaments/utils/server";
import TournamentSelector from "@/components/TournamentSelector";
import { Suspense } from "react";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tournaments = await getTournaments();

  return (
    <html lang="es">
      <body className={`antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>
            <TournamentProvider tournaments={tournaments}>
              <NavBar />
              <TournamentSelector />
              {children}
            </TournamentProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
