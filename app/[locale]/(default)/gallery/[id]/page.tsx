import { getMediaById, getMediaBySlug, getMediaByInfluencer } from "@/models/media";
import ImageViewer from "@/components/gallery/image-viewer";
import { notFound } from "next/navigation";
import moment from "moment";
import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { Post } from "@/types/post";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const revalidate = 60;

interface GalleryDetailPageProps {
  params: Promise<{
    id: string; // This can be an ID or a Slug
    locale: string;
  }>;
}

export async function generateMetadata(
  props: GalleryDetailPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const { id } = params;

  // Try fetching by slug first, then ID
  let result = await getMediaBySlug(id);
  if (!result) {
    result = await getMediaById(id);
  }

  if (!result) {
    return {
      title: "Gallery Not Found",
    };
  }

  const { post, images } = result;
  
  // Use the first image as the OG image
  const ogImages = images.length > 0 ? [images[0]] : [];

  return {
    title: post.title,
    description: post.content ? post.content.substring(0, 160) : `Check out ${post.title} gallery.`,
    openGraph: {
      title: post.title,
      description: post.content ? post.content.substring(0, 160) : undefined,
      images: ogImages,
    },
  };
}

export default async function GalleryDetailPage(props: GalleryDetailPageProps) {
  const params = await props.params;
  const {
    id,
    locale
  } = params;
  
  // Try fetching by slug first, then ID
  let result = await getMediaBySlug(id);
  if (!result) {
    result = await getMediaById(id);
  }

  if (!result) {
    notFound();
  }

  const { post, images } = result;

  // Fetch more from this influencer for immersive scrolling
  const { posts: relatedPosts } = post.influencer_id 
    ? await getMediaByInfluencer(post.influencer_id, 1, 5)
    : { posts: [] };

  const filteredRelatedPosts = relatedPosts.filter((p: Post) => (p.slug || p.uuid) !== id);

  // --- JSON-LD Construction ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": post.title,
    "description": post.content || post.title,
    "datePublished": post.created_at,
    "author": {
      "@type": "Person",
      "name": post.author_name || "Meizhi Girl",
      "url": `${process.env.NEXT_PUBLIC_WEB_URL || 'https://example.com'}/${locale}/u/${post.author_slug}`
    },
    "image": images.map(img => img), // Google likes direct image URLs
    "primaryImageOfPage": images[0]
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${locale}`}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${locale}/u`}>Users</BreadcrumbLink>
            </BreadcrumbItem>
            {post.author_name && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/${locale}/u/${post.author_slug}`}>
                    {post.author_name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1 max-w-[200px] md:max-w-none">
                {post.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center text-muted-foreground space-x-4">
             {post.author_name && post.author_name !== "Meizhi Spider" && (
                <>
                  <Link 
                    href={`/${locale}/u/${post.author_slug}`} 
                    className="text-primary hover:underline font-semibold"
                  >
                    {post.author_name}
                  </Link>
                  <span>•</span>
                </>
             )}
             <span>{post.created_at ? moment(post.created_at).format("YYYY-MM-DD") : ""}</span>
             <span>•</span>
             <span>{images.length} Photos</span>
        </div>
      </div>

      <ImageViewer 
        images={images} 
        title={post.title || "Gallery Image"} 
        nextPosts={filteredRelatedPosts}
        locale={locale}
      />
    </div>
  ); 
}
