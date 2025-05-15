import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import Header from "@/components/layout/Header";
import { getUser } from "@/lib/actions/auth";
import UserContextProvider from "@/context/userContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FinSync",
  description: "A simple way to manage your finances.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  const { data } = await getUser();
  const user = data?.user || null;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserContextProvider value={user}>
            <NextIntlClientProvider>
              <Header isAuthenticated={!!user} />
              {children}
              <Toaster />
            </NextIntlClientProvider>
          </UserContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
