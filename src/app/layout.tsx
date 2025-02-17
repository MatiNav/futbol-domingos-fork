import type { Metadata, Viewport } from "next";
import "./globals.css";
import NavBar from "./components/NavBar";
import AuthProvider from "./providers/AuthProvider";

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
      <AuthProvider>
        <body className={`antialiased`}>
          <NavBar />
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}
