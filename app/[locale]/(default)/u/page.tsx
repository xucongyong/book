import { getAllInfluencers } from "@/models/influencer";
import Link from "next/link";
import { Metadata } from "next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface ModelsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export const metadata: Metadata = {
  title: "Creators Directory - Professional Models & Influencers",
  description: "Browse our directory of professional models and influencers. Explore their latest photo series and galleries.",
};

export default async function ModelsPage(props: ModelsPageProps) {
  const params = await props.params;
  const { locale } = params;
  
  const influencers = await getAllInfluencers(1, 200);

  // --- JSON-LD Construction ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": influencers.map((inf, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Person",
        "name": inf.name,
        "url": `${process.env.NEXT_PUBLIC_WEB_URL || 'https://example.com'}/${locale}/u/${inf.slug}`
      }
    }))
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
              <BreadcrumbPage>Users</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold mb-4">Creators Directory</h1>
        <p className="text-muted-foreground">
          Explore all the talented creators and models on our platform.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {influencers.map((influencer) => (
          <Link
            key={influencer.id}
            href={`/${locale}/u/${influencer.slug}`}
            className="group block p-6 rounded-2xl bg-card border hover:border-primary hover:shadow-lg transition-all duration-300 text-center"
          >
            <Avatar className="w-20 h-20 mx-auto mb-4 border-2 border-transparent group-hover:border-primary transition-colors">
              <AvatarImage src={influencer.avatar_url || ""} alt={influencer.name} className="object-cover" />
              <AvatarFallback className="bg-muted text-muted-foreground text-2xl font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                {influencer.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h2 className="font-bold group-hover:text-primary truncate">
              {influencer.name}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              View Profile
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
