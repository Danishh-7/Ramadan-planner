import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ramadan Planner",
  description: "Track your spiritual journey through the blessed month",
};

import { NotificationProvider } from "@/components/providers/NotificationProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AlarmOverlay } from "@/components/ui/AlarmOverlay";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={outfit.variable}>
      <body className={`${outfit.className} antialiased`}>
        <NotificationProvider>
          <ThemeProvider>
            {children}
            <AlarmOverlay />
          </ThemeProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
