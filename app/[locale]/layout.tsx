import "../globals.css";

import { NextIntlClientProvider, useMessages } from "next-intl";

import { AppContextProvider } from "@/contexts/app";
import type { Metadata } from "next";
import { NextAuthSessionProvider } from "@/providers/session";
import { ThemeProvider } from "@/providers/theme";
import { Toaster } from "sonner";
import { getTranslations } from "next-intl/server";

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
        <link rel="alternate" hrefLang="zh" href="https://melodis.co/zh/" />
        <link rel="alternate" hrefLang="ar" href="https://melodis.co/ar/" />
        <link rel="alternate" hrefLang="x-default" href="https://melodis.co" />

        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-TYVCKPTYH1"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
            
              gtag('config', 'G-TYVCKPTYH1');
            `,
          }}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','G-TYVCKPTYH1');
            `,
          }}
        ></script>
      </head>

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
    </html>
  );
}
