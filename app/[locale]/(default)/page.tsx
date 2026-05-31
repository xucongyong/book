import { getAllPosts } from "@/models/post";
import GalleryGrid from "@/components/gallery/gallery-grid";
import ExamHero from "@/components/home/exam-hero";
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  let canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}`;

  if (locale !== "zh") {
    canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}`;
  }

  const t = await import(`@/i18n/messages/${locale}.json`).then(m => m.default.metadata);

  return {
    title: t.title,
    description: t.description,
    keywords: t.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <LandingPageContent params={params} />;
}

async function LandingPageContent({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await import(`@/i18n/messages/${locale}.json`).then(m => m.default.home);

  // Safely fetch posts, handling the case where the table might not exist yet
  let posts: any[] = [];
  try {
    posts = await getAllPosts(1, 20);
  } catch (error) {
    console.error("[Homepage] Error fetching exams:", error);
    // If table doesn't exist, we'll just show the empty state
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      
      {/* Exam Hero Section */}
      <ExamHero t={t} />

      {/* Latest Exams Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">{t.latest_exams}</h2>
            <button className="text-primary hover:underline font-medium">
                {t.view_all} &rarr;
            </button>
        </div>
        
        {posts && posts.length > 0 ? (
            <GalleryGrid posts={posts} locale={locale} />
        ) : (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <div className="max-w-md mx-auto space-y-4">
                    <p className="text-xl font-semibold text-slate-700">Ready to start your journey?</p>
                    <p className="text-muted-foreground">It looks like the examination database is being initialized. Once configured, your professional certifications and tests will appear here.</p>
                    <div className="pt-4">
                        <code className="px-2 py-1 bg-slate-100 rounded text-sm text-slate-600">
                            Status: Waiting for 'exam.posts' table
                        </code>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Trust / Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-t">
        <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
            <div className="text-muted-foreground">Active Candidates</div>
        </div>
        <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">500+</div>
            <div className="text-muted-foreground">Professional Certifications</div>
        </div>
        <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">99%</div>
            <div className="text-muted-foreground">Pass Rate Guarantee</div>
        </div>
      </div>
      
    </div>
  );
}
