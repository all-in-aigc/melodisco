import { getRequestConfig } from "next-intl/server";
import { locales } from "@/configs/locale";

export default getRequestConfig(async ({ locale }) => {
  if (["zh-CN", "zh-TW", "zh-HK"].includes(locale)) {
    locale = "zh";
  }

  if (!locales.includes(locale as any)) {
    locale = "en";
  }

  try {
    const messages = (await import(`@/messages/${locale}.json`)).default;
    return {
      messages: messages,
    };
  } catch (e) {
    return {
      messages: (await import(`@/messages/en.json`)).default,
    };
  }
});
