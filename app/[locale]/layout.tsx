import "../globals.css";

import { NextIntlClientProvider, useMessages } from "next-intl";

import { AppContextProvider } from "@/contexts/app";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { NextAuthSessionProvider } from "@/providers/session";
import { ThemeProvider } from "@/providers/theme";
import { Toaster } from "sonner";
import { getTranslations } from "next-intl/server";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = useMessages();

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/favicon.ico" />

        <link rel="alternate" hrefLang="en" href="https://melodis.co" />
        <link rel="alternate" hrefLang="ja" href="https://melodis.co/ja/" />
        <link rel="alternate" hrefLang="de" href="https://melodis.co/de/" />
        <link rel="alternate" hrefLang="ko" href="https://melodis.co/ko/" />
        <link rel="alternate" hrefLang="ru" href="https://melodis.co/ru/" />
        <link rel="alternate" hrefLang="fr" href="https://melodis.co/fr/" />
        <link rel="alternate" hrefLang="zh-CN" href="https://melodis.co/zh/" />
        <link rel="alternate" hrefLang="x-default" href="https://melodis.co" />
      </head>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <NextAuthSessionProvider>
            <AppContextProvider>
              <ThemeProvider>
                <Toaster position="top-center" richColors />
                {children}
              </ThemeProvider>
            </AppContextProvider>
          </NextAuthSessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
