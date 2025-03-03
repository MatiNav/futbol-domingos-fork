import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./components/NavBar";
import { UserProvider } from "@auth0/nextjs-auth0/client";

export const metadata: Metadata = {
  title: "Futbol",
  description: "Clausura 2025",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <UserProvider>
        <body className={`antialiased`}>
          <NavBar />
          {children}
        </body>
      </UserProvider>
    </html>
  );
}
