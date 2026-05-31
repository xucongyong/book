import { Feedback } from "@/types/feedback";
import pg_query from "@/lib/pg";
import { getUsersByUuids } from "./user";

export async function insertFeedback(feedback: Feedback) {
  const columns = Object.keys(feedback);
  const values = Object.values(feedback);
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');

  const query = `INSERT INTO feedbacks (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`;
  const rows = await pg_query(query, values);
  return rows[0];
}

export async function findFeedbackByUuid(
  uuid: string
): Promise<Feedback | undefined> {
  const rows = await pg_query('SELECT * FROM feedbacks WHERE uuid = $1 LIMIT 1', [uuid]);
  return rows[0];
}

export async function getFeedbacks(
  page: number = 1,
  limit: number = 50
): Promise<Feedback[] | undefined> {
  if (page < 1) page = 1;
  if (limit <= 0) limit = 50;

  const offset = (page - 1) * limit;
  const rows = await pg_query(
    'SELECT * FROM feedbacks ORDER BY created_at DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  );

  if (!rows || rows.length === 0) {
    return [];
  }

  const user_uuids = Array.from(new Set(rows.map((item: any) => item.user_uuid))) as string[];
  const users = await getUsersByUuids(user_uuids);

  const feedbacks = rows.map((item: any) => {
    const user = users.find((user) => user.uuid === item.user_uuid);
    return { ...item, user };
  });

  return feedbacks;
}
