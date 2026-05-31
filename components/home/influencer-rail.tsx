"use client";

import Link from "next/link";
import { Influencer } from "@/models/influencer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useTranslations } from "next-intl";

interface InfluencerRailProps {
  influencers: Influencer[];
  locale?: string;
}

export default function InfluencerRail({ influencers, locale }: InfluencerRailProps) {
  const t = useTranslations("home");

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-xl font-bold tracking-tight">{t("popular_goddesses")}</h2>
        <Link href={`/${locale}/u`} className="text-sm text-primary hover:underline">
          {t("view_all")}
        </Link>
      </div>
      
      <ScrollArea className="w-full whitespace-nowrap rounded-md border p-4">
        <div className="flex w-max space-x-6 p-1">
          {influencers.map((influencer) => (
            <Link 
              key={influencer.id} 
              href={`/${locale}/u/${influencer.slug}`}
              className="group flex flex-col items-center gap-2 w-20"
            >
              <div className="relative p-1 rounded-full border-2 border-transparent group-hover:border-primary transition-colors">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={influencer.avatar_url || ""} alt={influencer.name} className="object-cover" />
                    <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                        {influencer.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
              </div>
              <span className="text-xs font-medium text-center truncate w-full group-hover:text-primary transition-colors">
                {influencer.name}
              </span>
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
