"use client";

import { Post } from "@/types/post";
import GalleryCard from "./gallery-card";

interface GalleryGridProps {
  posts: Post[];
  locale?: string;
}

export default function GalleryGrid({ posts, locale }: GalleryGridProps) {
  return (
    <div className="masonry-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {posts.map((post) => (
        <GalleryCard key={post.uuid} post={post} locale={locale} />
      ))}
    </div>
  );
}
