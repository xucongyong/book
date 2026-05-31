import { getAllMediaSlugs } from "@/models/media";
import { getAllInfluencerSlugs } from "@/models/influencer";
import { MetadataRoute } from "next";
import { locales, defaultLocale } from "@/i18n/locale";

export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  
  // Helper to generate localized URL
  const getUrl = (path: string, locale: string) => {
    const isDefault = locale === defaultLocale;
    // Ensure path starts with /
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    
    if (isDefault) {
      return `${baseUrl}${normalizedPath}`;
    }
    return `${baseUrl}/${locale}${normalizedPath}`;
  };

  const routes: MetadataRoute.Sitemap = [];

  // 1. Static Routes
  // Add more static pages here if needed
  const staticPaths = ["", "/pricing", "/u"]; 

  for (const locale of locales) {
    for (const path of staticPaths) {
      routes.push({
        url: getUrl(path, locale),
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: path === "" ? 1 : 0.8,
      });
    }
  }

  // 2. Dynamic Routes (Galleries)
  let galleryRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await getAllMediaSlugs();
    for (const post of posts) {
      if (!post.slug) continue;
      for (const locale of locales) {
        galleryRoutes.push({
          url: getUrl(`/gallery/${post.slug}`, locale),
          lastModified: new Date(post.created_at || new Date()),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }
  } catch (error) {
    console.error("Failed to generate gallery routes:", error);
  }

  // 3. Dynamic Routes (Users)
  let userRoutes: MetadataRoute.Sitemap = [];
  try {
    const influencers = await getAllInfluencerSlugs();
    for (const influencer of influencers) {
      if (!influencer.slug) continue;
      for (const locale of locales) {
        userRoutes.push({
          url: getUrl(`/u/${influencer.slug}`, locale),
          lastModified: new Date(influencer.created_at || new Date()),
          changeFrequency: "weekly",
          priority: 0.9,
        });
      }
    }
  } catch (error) {
    console.error("Failed to generate user routes:", error);
  }

  return [...routes, ...galleryRoutes, ...userRoutes];
}

