import type { Metadata, Viewport } from "next";
import "./globals.css";
import NavBar from "./components/NavBar";
import AuthProvider from "./providers/AuthProvider";
import { TournamentProvider } from "./contexts/TournamentContext";
import { getTournaments } from "./features/tournaments/utils/server";
import TournamentSelector from "@/components/TournamentSelector";

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
      <AuthProvider>
        <TournamentProvider tournaments={tournaments}>
          <body className={`antialiased`}>
            <NavBar />
            <TournamentSelector />
            {children}
          </body>
        </TournamentProvider>
      </AuthProvider>
    </html>
  );
}
