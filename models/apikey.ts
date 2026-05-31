import { Apikey } from "@/types/apikey";
import pg_query from "@/lib/pg";

export enum ApikeyStatus {
  Created = "created",
  Deleted = "deleted",
}

export async function insertApikey(apikey: Apikey) {
  const columns = Object.keys(apikey);
  const values = Object.values(apikey);
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');

  const query = `INSERT INTO apikeys (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`;
  const rows = await pg_query(query, values);
  return rows[0];
}

export async function getUserApikeys(
  user_uuid: string,
  page: number = 1,
  limit: number = 50
): Promise<Apikey[] | undefined> {
  const offset = (page - 1) * limit;

  const rows = await pg_query(
    'SELECT * FROM apikeys WHERE user_uuid = $1 AND status != $2 ORDER BY created_at DESC LIMIT $3 OFFSET $4',
    [user_uuid, ApikeyStatus.Deleted, limit, offset]
  );
  return rows as Apikey[];
}

export async function getUserUuidByApiKey(
  apiKey: string
): Promise<string | undefined> {
  const rows = await pg_query(
    'SELECT user_uuid FROM apikeys WHERE api_key = $1 AND status = $2 LIMIT 1',
    [apiKey, ApikeyStatus.Created]
  );
  return rows[0]?.user_uuid;
}
