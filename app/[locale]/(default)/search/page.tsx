import { searchInfluencers } from "@/models/influencer";
import { searchMedia } from "@/models/media";
import InfluencerCard from "@/components/gallery/influencer-card";
import GalleryCard from "@/components/gallery/gallery-card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Results",
  description: "Search for your favorite models and series.",
};

interface SearchPageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SearchPage(props: SearchPageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const query = searchParams.q || "";
  const locale = params.locale;

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Search</h1>
        <p className="text-muted-foreground">Please enter a keyword to search.</p>
      </div>
    );
  }

  const influencers = await searchInfluencers(query);
  const { posts } = await searchMedia(query);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Search Results for <span className="text-primary">"{query}"</span>
      </h1>

      {/* Influencers Section */}
      {influencers.length > 0 && (
        <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">Models</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {influencers.map((influencer) => (
                <InfluencerCard key={influencer.id} influencer={influencer} locale={locale} />
            ))}
            </div>
        </div>
      )}

      {/* Posts Section */}
      {posts.length > 0 && (
        <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">Series & Albums</span>
            </h2>
             <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {posts.map((post) => (
                    <GalleryCard key={post.uuid} post={post} locale={locale} />
                ))}
            </div>
        </div>
      )}

      {influencers.length === 0 && posts.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No results found for "{query}".</p>
        </div>
      )}
    </div>
  );
}
