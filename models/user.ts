import { User } from "@/types/user";
import { getIsoTimestr } from "@/lib/time";
import pg_query from "@/lib/pg";

export async function insertUser(user: User) {
  const { uuid, email, nickname, avatar_url, created_at, updated_at } = user;
  const now = getIsoTimestr();
  const rows = await pg_query(
    'INSERT INTO users (uuid, email, nickname, avatar_url, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [uuid, email, nickname, avatar_url, created_at || now, updated_at || now]
  );
  return rows[0];
}

export async function findUserByEmail(
  email: string
): Promise<User | undefined> {
  const rows = await pg_query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
  return rows[0];
}

export async function findUserByUuid(uuid: string): Promise<User | undefined> {
  const rows = await pg_query('SELECT * FROM users WHERE uuid = $1 LIMIT 1', [uuid]);
  return rows[0];
}

export async function getUsers(
  page: number = 1,
  limit: number = 50
): Promise<User[] | undefined> {
  if (page < 1) page = 1;
  if (limit <= 0) limit = 50;
  const offset = (page - 1) * limit;

  const rows = await pg_query(
    'SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  return rows as User[];
}

export async function updateUserInviteCode(
  user_uuid: string,
  invite_code: string
) {
  const updated_at = getIsoTimestr();
  const rows = await pg_query(
    'UPDATE users SET invite_code = $1, updated_at = $2 WHERE uuid = $3 RETURNING *',
    [invite_code, updated_at, user_uuid]
  );
  return rows[0];
}

export async function updateUserInvitedBy(
  user_uuid: string,
  invited_by: string
) {
  const updated_at = getIsoTimestr();
  const rows = await pg_query(
    'UPDATE users SET invited_by = $1, updated_at = $2 WHERE uuid = $3 RETURNING *',
    [invited_by, updated_at, user_uuid]
  );
  return rows[0];
}

export async function getUsersByUuids(user_uuids: string[]): Promise<User[]> {
  const rows = await pg_query(
    'SELECT * FROM users WHERE uuid = ANY($1)',
    [user_uuids]
  );
  return rows as User[];
}

export async function findUserByInviteCode(invite_code: string) {
  const rows = await pg_query('SELECT * FROM users WHERE invite_code = $1 LIMIT 1', [invite_code]);
  return rows[0];
}

export async function getUserUuidsByEmail(email: string) {
  const rows = await pg_query('SELECT uuid FROM users WHERE email = $1', [email]);
  return rows.map((user: any) => user.uuid);
}

export async function updateUserMembership(
  user_uuid: string,
  expired_at: string
) {
  const updated_at = getIsoTimestr();

  // Fetch current credits to avoid overwriting other credit info
  const userRows = await pg_query('SELECT credits FROM users WHERE uuid = $1 LIMIT 1', [user_uuid]);
  if (!userRows || userRows.length === 0) throw new Error("User not found");

  const currentCredits = userRows[0].credits || {};
  const newCredits = {
    ...currentCredits,
    is_pro: true,
    membership_expired_at: expired_at,
  };

  const rows = await pg_query(
    'UPDATE users SET credits = $1, updated_at = $2 WHERE uuid = $3 RETURNING *',
    [JSON.stringify(newCredits), updated_at, user_uuid]
  );

  return rows[0];
}
