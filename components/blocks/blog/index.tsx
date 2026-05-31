import { Blog as BlogType } from "@/types/blocks/blog";
import MasonryGrid from "../masonry-grid";
import PostCard from "../post-card";

export default function Blog({ blog }: { blog: BlogType }) {
  if (!blog.items || blog.items.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="container px-4 md:px-6">
        <h2 className="mb-6 text-2xl font-bold tracking-tight">
           Latest Updates
        </h2>
        <MasonryGrid>
            {blog.items.map((post, index) => (
                <PostCard key={index} post={post} />
            ))}
        </MasonryGrid>
      </div>
    </section>
  );
}
