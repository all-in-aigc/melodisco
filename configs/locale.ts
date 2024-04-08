import { Pathnames } from "next-intl/navigation";

export const locales = [
  "en",
  "en-US",
  "en-UK",
  "zh",
  "zh-CN",
  "zh-HK",
  "zh-TW",
  "ja",
  "ko",
  "ru",
  "fr",
  "de",
  "ar",
];
export const localeNames: any = {
  en: "English",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
  ru: "Русский",
  fr: "Français",
  de: "Deutsch",
  ar: "اَلْعَرَبِيَّةُ",
};

export const defaultLocale = "en";

export const localePrefix = "as-needed";

export const localeDetection = true;

export const pathnames = {
  "/": "/",
} satisfies Pathnames<typeof locales>;
