"use client";

import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import Link from "next/link";

interface PayWallProps {
  title?: string;
  description?: string;
  price?: string;
  redirectUrl?: string;
}

export default function PayWall({
  title = "Unlock Full Content",
  description = "This post is for Pro members only. Upgrade to access premium content.",
  price = "$19/mo",
  redirectUrl = "/#pricing",
}: PayWallProps) {
  return (
    <div className="relative isolate overflow-hidden rounded-2xl bg-muted/50 border border-border px-6 py-24 text-center shadow-sm sm:px-16">
      <div className="mx-auto max-w-2xl flex flex-col items-center justify-center">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
          {description}
        </p>

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild size="lg">
            <Link href={redirectUrl}>
              Subscribe now for {price}
            </Link>
          </Button>
          <a href="/auth/signin" className="text-sm font-semibold leading-6 text-foreground">
            Log in <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
      
      {/* Background pattern */}
      <svg
        viewBox="0 0 1024 1024"
        className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
        aria-hidden="true"
      >
        <circle cx="512" cy="512" r="512" fill="url(#gradient)" fillOpacity="0.15" />
        <defs>
          <radialGradient id="gradient">
            <stop stopColor="currentColor" />
            <stop offset="1" stopColor="currentColor" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
