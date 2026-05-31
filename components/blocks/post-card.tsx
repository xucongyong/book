"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Lock, Unlock } from "lucide-react";

import Link from "next/link";
import { Post } from "@/types/post";
import { cn } from "@/lib/utils";
import moment from "moment";

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/${post.locale}/posts/${post.slug}`} className="group block mb-4 break-inside-avoid">
      <div className="relative overflow-hidden rounded-xl bg-card border shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
        {/* Cover Image */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted/50">
           {/* If we had a next/image here it would be better, but standard img for now to handle external URLs easily */}
           <img 
            src={post.cover_url || "https://placehold.co/600x800/png?text=No+Cover"} 
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
           />
           
           {/* VIP Badge */}
           {post.is_paid && (
             <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs font-semibold text-amber-400 backdrop-blur-sm">
               <Lock className="h-3 w-3" />
               <span>VIP</span>
             </div>
           )}
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="line-clamp-2 text-sm font-bold leading-tight group-hover:text-primary mb-2">
            {post.title}
          </h3>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
             <div className="flex items-center gap-2">
                {post.author_avatar_url && (
                    <Avatar className="h-5 w-5">
                        <AvatarImage src={post.author_avatar_url} />
                    </Avatar>
                )}
                <span className="truncate max-w-[80px]">{post.author_name}</span>
             </div>
             <span>{post.created_at ? moment(post.created_at).fromNow(true) : ""}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
