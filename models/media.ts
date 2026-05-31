import pg_query from "@/lib/pg";
import { Post } from "@/types/post";

export interface MediaItem {
  id: string;
  title: string;
  slug: string | null;
  keywords: string[] | null;
  description: string | null;
  url: string;
  content: string | null;
  metadata: any;
  images: any;
  download_status: number;
  created_at: string;
  influencer_id: string | null;
  influencer_name?: string;
  influencer_slug?: string;
}

/**
 * Convert DB MediaItem to Frontend Post
 */
function mapMediaToPost(item: any): Post {
  let imageList: string[] = [];
  
  if (Array.isArray(item.images)) {
    imageList = item.images;
  } else if (typeof item.images === 'string') {
    try {
        imageList = JSON.parse(item.images);
    } catch(e) { 
        imageList = []; 
    }
  }

  const coverRemote = imageList.length > 0 ? imageList[0] : null;

  return {
    uuid: item.id,
    title: item.title,
    slug: item.slug || item.id,
    content: item.content || item.description || "",
    cover_url: coverRemote || "",
    created_at: item.created_at,
    author_name: item.influencer_name || "Meizhi Spider", 
    author_slug: item.influencer_slug || "",
    is_paid: false,
    locale: "en", 
    images: imageList,
    tags: item.keywords || [],
    influencer_id: item.influencer_id || "",
  };
}

export async function getMediaPosts(
  page: number = 1,
  limit: number = 24
): Promise<{ posts: Post[], total: number }> {
  const offset = (page - 1) * limit;
  
  const rows = await pg_query(`
    SELECT m.*, i.name as influencer_name, i.slug as influencer_slug, count(*) OVER() AS total_count
    FROM media m
    LEFT JOIN influencers i ON m.influencer_id = i.id
    ORDER BY m.created_at DESC
    LIMIT $1 OFFSET $2
  `, [limit, offset]);

  const total = rows.length > 0 ? parseInt(rows[0].total_count) : 0;

  return {
    posts: rows.map(mapMediaToPost),
    total
  };
}

export async function getMediaById(id: string): Promise<{ post: Post, images: string[] } | null> {
    const rows = await pg_query(`
      SELECT m.*, i.name as influencer_name, i.slug as influencer_slug
      FROM media m
      LEFT JOIN influencers i ON m.influencer_id = i.id
      WHERE m.id = $1
      LIMIT 1
    `, [id]);
  
    if (!rows || rows.length === 0) return null;
  
    const item = rows[0];
    const mappedPost = mapMediaToPost(item);

    let imageList: string[] = [];
    if (Array.isArray(item.images)) {
        imageList = item.images;
    } else if (typeof item.images === 'string') {
        try { imageList = JSON.parse(item.images); } catch(e) {}
    }

    const FREE_LIMIT = 5;
    const securedImages = imageList.map((img, index) => {
        if (!img) return null;
        if (index < FREE_LIMIT) return img;
        return "LOCKED";
    }).filter(s => s !== null) as string[];

    return {
        post: mappedPost,
        images: securedImages
    };
}

export async function getMediaBySlug(slug: string): Promise<{ post: Post, images: string[] } | null> {
    const rows = await pg_query(`
      SELECT m.*, i.name as influencer_name, i.slug as influencer_slug
      FROM media m
      LEFT JOIN influencers i ON m.influencer_id = i.id
      WHERE m.slug = $1
      LIMIT 1
    `, [slug]);
  
    if (!rows || rows.length === 0) return null;
  
    const item = rows[0];
    const mappedPost = mapMediaToPost(item);

    let imageList: string[] = [];
    if (Array.isArray(item.images)) {
        imageList = item.images;
    } else if (typeof item.images === 'string') {
        try { imageList = JSON.parse(item.images); } catch(e) {}
    }

    const FREE_LIMIT = 5;
    const securedImages = imageList.map((img, index) => {
        if (!img) return null;
        if (index < FREE_LIMIT) return img;
        return "LOCKED";
    }).filter(s => s !== null) as string[];

    return {
        post: mappedPost,
        images: securedImages
    };
}

export async function getMediaByInfluencer(influencerId: string, page: number = 1, limit: number = 50): Promise<{ posts: Post[] }> {
    const offset = (page - 1) * limit;
    const rows = await pg_query(`
        SELECT m.*, i.name as influencer_name, i.slug as influencer_slug
        FROM media m
        LEFT JOIN influencers i ON m.influencer_id = i.id
        WHERE m.influencer_id = $1
        ORDER BY m.created_at DESC
        LIMIT $2 OFFSET $3
    `, [influencerId, limit, offset]);

    return {
        posts: rows.map(mapMediaToPost)
    };
}

// Keep old names for backward compatibility during migration if necessary
export const getMeizhiPostBySlug = getMediaBySlug;

export async function searchMedia(query: string, limit: number = 20): Promise<{ posts: Post[] }> {
    const rows = await pg_query(`
        SELECT m.*, i.name as influencer_name, i.slug as influencer_slug
        FROM media m
        LEFT JOIN influencers i ON m.influencer_id = i.id
        WHERE m.title ILIKE $1 OR m.description ILIKE $1
        ORDER BY m.created_at DESC
        LIMIT $2
    `, [`%${query}%`, limit]);

    return {
        posts: rows.map(mapMediaToPost)
    };
}
// ... existing code

export async function getAllMediaSlugs(): Promise<{ slug: string; created_at: string }[]> {
    const rows = await pg_query(`
        SELECT slug, created_at FROM media ORDER BY created_at DESC LIMIT 5000
    `);
    return rows as { slug: string; created_at: string }[];
}
