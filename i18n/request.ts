import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import enMessages from "./messages/en.json";
import zhMessages from "./messages/zh.json";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  if (["zh-CN", "zh"].includes(locale)) {
    locale = "zh";
  } else {
    locale = "en";
  }

  const messages = locale === "zh" ? zhMessages : enMessages;

  return {
    locale: locale,
    messages: messages,
  };
});