import { Post } from "@/types/post";
import pg_query from "@/lib/pg";

export enum PostStatus {
  Created = "created",
  Deleted = "deleted",
  Online = "online",
  Offline = "offline",
}

export async function insertPost(post: Post) {
  const columns = Object.keys(post);
  const values = Object.values(post);
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');

  const query = `INSERT INTO posts (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`;
  const rows = await pg_query(query, values);
  return rows[0];
}

export async function updatePost(uuid: string, post: Partial<Post>) {
  const columns = Object.keys(post);
  const values = Object.values(post);
  const setClause = columns.map((col, i) => `${col} = $${i + 1}`).join(', ');
  
  const query = `UPDATE posts SET ${setClause} WHERE uuid = $${columns.length + 1} RETURNING *`;
  const rows = await pg_query(query, [...values, uuid]);
  return rows[0];
}

export async function findPostByUuid(uuid: string): Promise<Post | undefined> {
  const rows = await pg_query('SELECT * FROM posts WHERE uuid = $1 LIMIT 1', [uuid]);
  return rows[0];
}

export async function findPostBySlug(
  slug: string,
  locale: string
): Promise<Post | undefined> {
  const rows = await pg_query('SELECT * FROM posts WHERE slug = $1 AND locale = $2 LIMIT 1', [slug, locale]);
  return rows[0];
}

export async function getAllPosts(
  page: number = 1,
  limit: number = 50
): Promise<Post[]> {
  const offset = (page - 1) * limit;
  const rows = await pg_query(
    'SELECT * FROM posts ORDER BY created_at DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  return rows as Post[];
}

export async function getPostsByLocale(
  locale: string,
  page: number = 1,
  limit: number = 50
): Promise<Post[]> {
  const offset = (page - 1) * limit;
  const rows = await pg_query(
    'SELECT * FROM posts WHERE locale = $1 AND status = $2 ORDER BY created_at DESC LIMIT $3 OFFSET $4',
    [locale, PostStatus.Online, limit, offset]
  );
  return rows as Post[];
}
