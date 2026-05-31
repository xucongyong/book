import { LandingPage } from "@/types/pages/landing";
import en from "@/i18n/pages/landing/en.json";
import zh from "@/i18n/pages/landing/zh.json";

export async function getLandingPage(locale: string): Promise<LandingPage> {
  const normalizedLocale = locale.toLowerCase();
  
  if (normalizedLocale === "zh" || normalizedLocale === "zh-cn") {
    return zh as LandingPage;
  }
  
  return en as LandingPage;
}