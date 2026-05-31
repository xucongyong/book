"use client";

import Link from "next/link";
import { Influencer } from "@/models/influencer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface InfluencerCardProps {
  influencer: Influencer;
  locale?: string;
}

export default function InfluencerCard({ influencer, locale = "en" }: InfluencerCardProps) {
  const href = `/${locale}/u/${influencer.slug}`;

  return (
    <Link href={href} className="group block mb-4 break-inside-avoid">
        <div className="flex flex-col items-center p-4 rounded-xl bg-card border shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
            <Avatar className="w-24 h-24 mb-4 border-2 border-transparent group-hover:border-primary transition-colors">
                <AvatarImage src={influencer.avatar_url} alt={influencer.name} className="object-cover" />
                <AvatarFallback>{influencer.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <h3 className="text-lg font-bold text-center group-hover:text-primary transition-colors">
                {influencer.name}
            </h3>
            {influencer.aliases && influencer.aliases.length > 0 && (
                <p className="text-xs text-muted-foreground text-center line-clamp-1 mt-1">
                    Also known as: {influencer.aliases.join(", ")}
                </p>
            )}
        </div>
    </Link>
  );
}
