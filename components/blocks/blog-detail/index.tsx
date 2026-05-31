import { Avatar, AvatarImage } from "@/components/ui/avatar";

import Crumb from "./crumb";
import Markdown from "@/components/markdown";
import { Post } from "@/types/post";
import moment from "moment";
import { getUserInfo } from "@/services/user";
import PayWall from "../pay-wall";

export default async function BlogDetail({ post }: { post: Post }) {
  // Check user permission
  const user = await getUserInfo();
  
  const isVip = user?.credits?.is_pro || false;
  // If is_paid is false, everyone can see. If is_paid is true, only VIP can see FULL content.
  // But we might have "Free Preview" content before the PAYWALL marker.
  const canViewFull = !post.is_paid || isVip;

  let freeContent = post.content || "";
  let paidContent = "";
  const PAYWALL_MARKER = "<!--PAYWALL-->";

  if (post.content && post.content.includes(PAYWALL_MARKER)) {
    const parts = post.content.split(PAYWALL_MARKER);
    freeContent = parts[0];
    paidContent = parts[1];
  } else if (post.is_paid && !canViewFull) {
    // Fallback: If no marker but is paid, show snippet
    freeContent = post.content?.slice(0, 200) + "..." || "";
    paidContent = post.content || ""; // Conceptual, we just block logically
  }

  return (
    <section className="py-16">
      <div className="container">
        <Crumb post={post} />
        <h1 className="mb-7 mt-9 max-w-3xl text-2xl font-bold md:mb-10 md:text-4xl">
          {post.title}
        </h1>
        <div className="flex items-center gap-3 text-sm md:text-base">
          {post.author_avatar_url && (
            <Avatar className="h-8 w-8 border">
              <AvatarImage
                src={post.author_avatar_url}
                alt={post.author_name}
              />
            </Avatar>
          )}
          <div>
            {post.author_name && (
              <span className="font-medium">{post.author_name}</span>
            )}

            <span className="ml-2 text-muted-foreground">
              on {post.created_at && moment(post.created_at).fromNow()}
            </span>
          </div>
        </div>
        
        <div className="relative py-8 grid max-w-screen-xl gap-4 lg:mt-0 lg:grid lg:grid-cols-12 lg:gap-6">
          <div className="order-2 lg:order-none lg:col-span-8">
            {/* Always show free content */}
            <Markdown content={freeContent} />

            {/* If has paid content (or is paid post) */}
            {(post.is_paid || paidContent) && (
                canViewFull ? (
                    // User is VIP -> Show remaining content
                    paidContent ? <Markdown content={paidContent} /> : (post.content && !post.content.includes(PAYWALL_MARKER) && <Markdown content={post.content.slice(200)} />)
                ) : (
                    // User is NOT VIP -> Show Paywall
                    <div className="relative mt-8">
                        {/* Blurred preview of paid content (if we have it, or dummy) */}
                        <div className="blur-md select-none opacity-50 h-64 overflow-hidden" aria-hidden="true">
                            <Markdown content={paidContent || "Additional premium content hidden..."} />
                        </div>
                        
                        {/* PayWall Overlay */}
                        <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
                             <PayWall />
                        </div>
                    </div>
                )
            )}
          </div>
          <div className="order-1 flex h-fit flex-col text-sm lg:sticky lg:top-8 lg:order-none lg:col-span-3 lg:col-start-10 lg:text-xs"></div>
        </div>
      </div>
    </section>
  );
}
