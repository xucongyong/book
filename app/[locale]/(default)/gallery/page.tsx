
import { getMediaPosts } from "@/models/media";
import GalleryGrid from "@/components/gallery/gallery-grid";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const revalidate = 60; 

interface GalleryPageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function GalleryPage(props: GalleryPageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { locale } = params;
  
  const currentPage = parseInt(searchParams.page || "1");
  const limit = 48;

  const { posts, total } = await getMediaPosts(currentPage, limit);
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Meizhi Gallery</h1>
        <p className="text-muted-foreground text-sm">{total} items found</p>
      </div>
      
      <GalleryGrid posts={posts} locale={locale} />

      {/* Pagination UI */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center space-x-4">
          {currentPage > 1 ? (
            <Link href={`/${locale}/gallery?page=${currentPage - 1}`}>
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
          )}

          <div className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </div>

          {currentPage < totalPages ? (
            <Link href={`/${locale}/gallery?page=${currentPage + 1}`}>
              <Button variant="outline" size="sm">
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
