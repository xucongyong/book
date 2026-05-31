import { Order } from "@/types/order";
import pg_query from "@/lib/pg";

export enum OrderStatus {
  Created = "created",
  Paid = "paid",
  Deleted = "deleted",
}

export async function insertOrder(order: Order) {
  const columns = Object.keys(order);
  const values = Object.values(order);
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
  
  const query = `INSERT INTO orders (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`;
  const rows = await pg_query(query, values);
  return rows[0];
}

export async function findOrderByOrderNo(
  order_no: string
): Promise<Order | undefined> {
  const rows = await pg_query('SELECT * FROM orders WHERE order_no = $1 LIMIT 1', [order_no]);
  return rows[0];
}

export async function getFirstPaidOrderByUserUuid(
  user_uuid: string
): Promise<Order | undefined> {
  const rows = await pg_query(
    'SELECT * FROM orders WHERE user_uuid = $1 AND status = $2 ORDER BY created_at ASC LIMIT 1',
    [user_uuid, 'paid']
  );
  return rows[0];
}

export async function getFirstPaidOrderByUserEmail(
  user_email: string
): Promise<Order | undefined> {
  const rows = await pg_query(
    'SELECT * FROM orders WHERE user_email = $1 AND status = $2 ORDER BY created_at ASC LIMIT 1',
    [user_email, 'paid']
  );
  return rows[0];
}

export async function updateOrderStatus(
  order_no: string,
  status: string,
  paid_at: string,
  paid_email: string,
  paid_detail: string
) {
  const rows = await pg_query(
    'UPDATE orders SET status = $1, paid_at = $2, paid_detail = $3, paid_email = $4 WHERE order_no = $5 RETURNING *',
    [status, paid_at, paid_detail, paid_email, order_no]
  );
  return rows[0];
}

export async function updateOrderSession(
  order_no: string,
  stripe_session_id: string,
  order_detail: string
) {
  const rows = await pg_query(
    'UPDATE orders SET stripe_session_id = $1, order_detail = $2 WHERE order_no = $3 RETURNING *',
    [stripe_session_id, order_detail, order_no]
  );
  return rows[0];
}

export async function updateOrderSubscription(
  order_no: string,
  sub_id: string,
  sub_interval_count: number,
  sub_cycle_anchor: number,
  sub_period_end: number,
  sub_period_start: number,
  status: string,
  paid_at: string,
  sub_times: number,
  paid_email: string,
  paid_detail: string
) {
  const rows = await pg_query(
    `UPDATE orders SET 
      sub_id = $1, sub_interval_count = $2, sub_cycle_anchor = $3, 
      sub_period_end = $4, sub_period_start = $5, status = $6, 
      paid_at = $7, sub_times = $8, paid_email = $9, paid_detail = $10 
    WHERE order_no = $11 RETURNING *`,
    [
      sub_id, sub_interval_count, sub_cycle_anchor, sub_period_end, 
      sub_period_start, status, paid_at, sub_times, paid_email, 
      paid_detail, order_no
    ]
  );
  return rows[0];
}

export async function getOrdersByUserUuid(
  user_uuid: string
): Promise<Order[] | undefined> {
  const rows = await pg_query(
    'SELECT * FROM orders WHERE user_uuid = $1 AND status = $2 ORDER BY created_at DESC',
    [user_uuid, 'paid']
  );
  return rows as Order[];
}

export async function getOrdersByUserEmail(
  user_email: string
): Promise<Order[] | undefined> {
  const rows = await pg_query(
    'SELECT * FROM orders WHERE user_email = $1 AND status = $2 ORDER BY created_at DESC',
    [user_email, 'paid']
  );
  return rows as Order[];
}

export async function getOrdersByPaidEmail(
  paid_email: string
): Promise<Order[] | undefined> {
  const rows = await pg_query(
    'SELECT * FROM orders WHERE paid_email = $1 AND status = $2 ORDER BY created_at DESC',
    [paid_email, 'paid']
  );
  return rows as Order[];
}

export async function getPaiedOrders(
  page: number,
  limit: number
): Promise<Order[] | undefined> {
  const offset = (page - 1) * limit;
  const rows = await pg_query(
    'SELECT * FROM orders WHERE status = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
    ['paid', limit, offset]
  );
  return rows as Order[];
}
