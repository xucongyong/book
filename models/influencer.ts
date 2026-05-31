import pg_query from "@/lib/pg";

export interface Influencer {
  id: string;
  name: string;
  slug: string;
  avatar_url?: string;
  description?: string;
  aliases?: string[];
  created_at: string;
}

export async function getInfluencerBySlug(slug: string): Promise<Influencer | null> {
  const rows = await pg_query('SELECT * FROM influencers WHERE slug = $1 LIMIT 1', [slug]);
  if (!rows || rows.length === 0) return null;
  return rows[0] as Influencer;
}

export async function getInfluencerById(id: string): Promise<Influencer | null> {
  const rows = await pg_query('SELECT * FROM influencers WHERE id = $1 LIMIT 1', [id]);
  if (!rows || rows.length === 0) return null;
  return rows[0] as Influencer;
}

export async function getAllInfluencers(page: number = 1, limit: number = 20): Promise<Influencer[]> {
  const offset = (page - 1) * limit;
  const rows = await pg_query(
    'SELECT * FROM influencers ORDER BY name ASC LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  return rows as Influencer[];
}

export async function searchInfluencers(query: string, limit: number = 20): Promise<Influencer[]> {
  // Simple search for now
  const rows = await pg_query(
    'SELECT * FROM influencers WHERE name ILIKE $1 OR aliases::text ILIKE $1 LIMIT $2',
    [`%${query}%`, limit]
  );
  return rows as Influencer[];
}
// ... existing code

export async function getAllInfluencerSlugs(): Promise<{ slug: string; created_at: string }[]> {
  const rows = await pg_query(
    'SELECT slug, created_at FROM influencers ORDER BY created_at DESC LIMIT 5000'
  );
  return rows as { slug: string; created_at: string }[];
}
