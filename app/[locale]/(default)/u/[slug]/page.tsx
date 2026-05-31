import { getInfluencerBySlug } from "@/models/influencer";
import { getMediaByInfluencer } from "@/models/media";
import GalleryGrid from "@/components/gallery/gallery-grid";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface ModelPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export async function generateMetadata(
  props: ModelPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const decodedSlug = decodeURIComponent(params.slug);
  const influencer = await getInfluencerBySlug(decodedSlug);

  if (!influencer) {
    return { title: "Model Not Found" };
  }

  return {
    title: `${influencer.name} - All Photo Series & Albums`,
    description: `View all high-quality photo series and albums of ${influencer.name}. Browse latest updates and high-resolution galleries.`,
    openGraph: {
        title: influencer.name,
        description: influencer.description || `Archives of ${influencer.name}`,
    }
  };
}

export default async function ModelPage(props: ModelPageProps) {
  const params = await props.params;
  const { slug, locale } = params;
  const decodedSlug = decodeURIComponent(slug);

  const influencer = await getInfluencerBySlug(decodedSlug);

  if (!influencer) {
    notFound();
  }

  const { posts } = await getMediaByInfluencer(influencer.id, 1, 100);

  // --- JSON-LD Construction ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": influencer.name,
      "alternateName": influencer.aliases,
      "description": influencer.description,
      "image": influencer.avatar_url,
      "url": `${process.env.NEXT_PUBLIC_WEB_URL || 'https://example.com'}/${locale}/u/${influencer.slug}`
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
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
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{influencer.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold mb-4">{influencer.name}</h1>
        
        {influencer.aliases && influencer.aliases.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-4">
                {influencer.aliases.map((alias, index) => (
                    <span key={index} className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground">
                        {alias}
                    </span>
                ))}
            </div>
        )}

        {influencer.description && (
          <p className="text-muted-foreground max-w-2xl mx-auto italic">
            {influencer.description}
          </p>
        )}
        <div className="mt-4 flex justify-center gap-4 text-sm text-muted-foreground">
          <span>{posts.length} Series</span>
        </div>
      </div>

      <GalleryGrid posts={posts} locale={locale} />
    </div>
  );
}
