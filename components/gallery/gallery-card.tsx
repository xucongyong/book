"use client";

import { Lock } from "lucide-react";
import Link from "next/link";
import { Post } from "@/types/post";
import moment from "moment";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface GalleryCardProps {
  post: Post;
  locale?: string;
}

export default function GalleryCard({ post, locale = "en" }: GalleryCardProps) {
  // Use the mapped slug (which is the ID) or the UUID directly
  // Prefer slug for SEO, fallback to UUID if missing
  const href = `/${locale}/gallery/${post.slug || post.uuid}`;

  return (
    <Link href={href} className="group block mb-4 break-inside-avoid">
      <div className="relative overflow-hidden rounded-xl bg-card border shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
        {/* Cover Image */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted/50">
          <img
            src={post.cover_url || "https://placehold.co/600x800/png?text=No+Cover"}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="line-clamp-2 text-sm font-bold leading-tight group-hover:text-primary mb-2">
            {post.title}
          </h3>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
             <div className="flex items-center gap-2">
                <Link 
                  href={`/${locale}/u/${post.author_slug}`}
                  className="truncate max-w-[80px] hover:text-primary transition-colors cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  {post.author_name}
                </Link>
             </div>
             <span>{post.created_at ? moment(post.created_at).fromNow(true) : ""}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
