import {
  defaultLocale,
  localeDetection,
  localePrefix,
  locales,
  pathnames,
} from "@/configs/locale";

import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix,
  localeDetection,
  pathnames,
});

export const config = {
  matcher: [
    "/",
    "/(en|en-US|zh|zh-CN|zh-TW|zh-HK|zh-MO|ja|ko|ru|fr|de|ar)/:path*",
    "/((?!privacy-policy|terms-of-service|api|_next|_vercel|.*\\..*).*)",
  ],
};
