import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "./globals.css";
import './animations.css';
import { UserProvider } from '../components/UserProvider';
import Providers from './providers'
import { Toaster } from "@/components/ui/toaster"
const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Padel Manager",
  description: "Sistema de gestión para canchas de padel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body suppressHydrationWarning={true} className="bg-gray-200">
        <Providers>
          <UserProvider>
            {children}
            <Toaster />
          </UserProvider>
        </Providers>
      </body>
    </html>
  );
}
