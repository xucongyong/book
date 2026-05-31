import { Credit } from "@/types/credit";
import pg_query from "@/lib/pg";

export async function insertCredit(credit: Credit) {
  const columns = Object.keys(credit);
  const values = Object.values(credit);
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');

  const query = `INSERT INTO credits (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`;
  const rows = await pg_query(query, values);
  return rows[0];
}

export async function findCreditByTransNo(
  trans_no: string
): Promise<Credit | undefined> {
  const rows = await pg_query('SELECT * FROM credits WHERE trans_no = $1 LIMIT 1', [trans_no]);
  return rows[0];
}

export async function findCreditByOrderNo(
  order_no: string
): Promise<Credit | undefined> {
  const rows = await pg_query('SELECT * FROM credits WHERE order_no = $1 LIMIT 1', [order_no]);
  return rows[0];
}

export async function getUserValidCredits(
  user_uuid: string
): Promise<Credit[] | undefined> {
  const now = new Date().toISOString();
  const rows = await pg_query(
    'SELECT * FROM credits WHERE user_uuid = $1 AND expired_at >= $2 ORDER BY expired_at ASC',
    [user_uuid, now]
  );
  return rows as Credit[];
}

export async function getCreditsByUserUuid(
  user_uuid: string,
  page: number = 1,
  limit: number = 50
): Promise<Credit[] | undefined> {
  const offset = (page - 1) * limit;
  const rows = await pg_query(
    'SELECT * FROM credits WHERE user_uuid = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
    [user_uuid, limit, offset]
  );
  return rows as Credit[];
}
