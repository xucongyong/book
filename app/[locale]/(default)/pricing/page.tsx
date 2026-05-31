import PricingBlock from "@/components/blocks/pricing";
import { Metadata } from "next";
import enPricing from "@/i18n/pages/pricing/en.json";
import zhPricing from "@/i18n/pages/pricing/zh.json";

interface PricingPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export const metadata: Metadata = {
  title: "Pricing & Membership - Meizhi Girl",
  description: "Join our membership to unlock premium galleries and exclusive content.",
};

function getPricingData(locale: string) {
  const normalizedLocale = locale.toLowerCase();
  if (normalizedLocale === "zh" || normalizedLocale === "zh-cn") {
    return zhPricing;
  }
  return enPricing;
}

export default async function PricingPage(props: PricingPageProps) {
  const params = await props.params;
  const { locale } = params;
  
  const data = getPricingData(locale);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          {data.header?.title}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {data.header?.description}
        </p>
      </div>

      <PricingBlock pricing={data.pricing as any} />
    </div>
  );
}