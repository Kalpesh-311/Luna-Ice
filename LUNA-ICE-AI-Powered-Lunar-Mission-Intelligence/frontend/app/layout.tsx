import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Lunar Mission Control",
  description: "AI Powered Lunar Landing Intelligence Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen">
            <Sidebar />
            <main className="ml-72 p-8">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
