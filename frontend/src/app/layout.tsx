import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DataProvider } from "@/app/contexts/DataProvider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Education Management System",
  description: "Manage educational institutions, centers, students, and results",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DataProvider>
          {children}
          <Toaster />
        </DataProvider>
      </body>
    </html>
  );
}
