import { Affiliate } from "@/types/affiliate";
import pg_query from "@/lib/pg";
import { getUsersByUuids } from "./user";

export async function insertAffiliate(affiliate: Affiliate) {
  const { user_uuid, invited_by, created_at, status, paid_order_no, paid_amount, reward_percent, reward_amount } = affiliate;
  const rows = await pg_query(`
    INSERT INTO affiliates (user_uuid, invited_by, created_at, status, paid_order_no, paid_amount, reward_percent, reward_amount)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
  `, [user_uuid, invited_by, created_at, status, paid_order_no, paid_amount, reward_percent, reward_amount]);
  return rows[0];
}

export async function getUserAffiliates(
  user_uuid: string,
  page: number = 1,
  limit: number = 50
): Promise<Affiliate[] | undefined> {
  const offset = (page - 1) * limit;
  const rows = await pg_query(
    'SELECT * FROM affiliates WHERE invited_by = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
    [user_uuid, limit, offset]
  );

  if (!rows || rows.length === 0) {
    return undefined;
  }

  const user_uuids = Array.from(new Set(rows.map((item: any) => item.user_uuid))) as string[];
  const users = await getUsersByUuids(user_uuids);
  
  const affiliates = rows.map((item: any) => {
    const user = users.find((user) => user.uuid === item.user_uuid);
    return { ...item, user };
  });

  return affiliates;
}

export async function getAffiliateSummary(user_uuid: string) {
  const rows = await pg_query('SELECT * FROM affiliates WHERE invited_by = $1', [user_uuid]);
  
  const summary = {
    total_invited: 0,
    total_paid: 0,
    total_reward: 0,
  };

  if (!rows || rows.length === 0) {
    return summary;
  }

  const invited_users = new Set();
  const paid_users = new Set();

  rows.forEach((item: any) => {
    invited_users.add(item.user_uuid);
    if (item.paid_amount > 0) {
      paid_users.add(item.user_uuid);
      summary.total_reward += item.reward_amount;
    }
  });

  summary.total_invited = invited_users.size;
  summary.total_paid = paid_users.size;

  return summary;
}

export async function findAffiliateByOrderNo(order_no: string) {
  const rows = await pg_query('SELECT * FROM affiliates WHERE paid_order_no = $1 LIMIT 1', [order_no]);
  return rows[0];
}

export async function getAllAffiliates(
  page: number = 1,
  limit: number = 50
): Promise<Affiliate[]> {
  const offset = (page - 1) * limit;
  const rows = await pg_query(
    'SELECT * FROM affiliates ORDER BY created_at DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  );

  if (!rows || rows.length === 0) {
    return [];
  }

  const user_uuids = Array.from(new Set(rows.map((item: any) => item.user_uuid))) as string[];
  const invited_by_uuids = Array.from(new Set(rows.map((item: any) => item.invited_by))) as string[];

  const users = await getUsersByUuids(user_uuids);
  const invited_by_users = await getUsersByUuids(invited_by_uuids);

  const affiliates = rows.map((item: any) => {
    const user = users.find((user) => user.uuid === item.user_uuid);
    const invited_by = invited_by_users.find((user) => user.uuid === item.invited_by);
    return { ...item, user, invited_by_user: invited_by };
  });

  return affiliates;
}
