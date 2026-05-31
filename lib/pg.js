import postgres from "postgres";

/**
 * 极简稳健版 pg_query
 */
async function pg_query(first, ...rest) {
  let connectionString;
  let isHyperdrive = false;

  // 1. 尝试从 Cloudflare Context 获取 Hyperdrive
  try {
    // 动态导入以避免本地开发环境下缺少依赖报错
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const context = await getCloudflareContext();
    connectionString = context.env?.HYPERDRIVE?.connectionString;
    if (connectionString) isHyperdrive = true;
  } catch (e) {
    // console.log("[DB] Not in Cloudflare environment or @opennextjs/cloudflare missing");
  }

  // 2. 如果没有 Hyperdrive (本地开发)，使用环境变量或默认连接字符串
  if (!connectionString || global._direct_db) {
      connectionString = process.env.DATABASE_URL || `postgresql://postgres:1121hotsren@v.xucongyong.com:5432/postgres`;
      isHyperdrive = false;
  }

  // 3. 设置 Search Path 为 'exam'
  // 为连接字符串添加 search_path 参数，这样所有查询都会默认在 exam 库下进行
  const url = new URL(connectionString);
  url.searchParams.set('options', '-c search_path=exam,public');
  const finalConnectionString = url.toString();

  const maskedConn = finalConnectionString.replace(/:([^:@]+)@/, ':****@');
  console.log(`[DB] Mode: ${isHyperdrive ? 'HYPERDRIVE' : 'DIRECT'} | Schema: exam | Target: ${maskedConn}`);

  const sql = postgres(finalConnectionString, {
    prepare: false,
    connect_timeout: 10,
    ssl: isHyperdrive ? false : { rejectUnauthorized: false }
  });

  try {
    let result;
    if (typeof first === 'string') {
      result = await sql.unsafe(first, rest[0] || []);
    } else {
      result = await sql(first, ...rest);
    }

    if (Array.isArray(result)) {
        result.rows = result;
    }
    return result;
  } finally {
    await sql.end({ timeout: 0.1 }).catch(() => {});
  }
}

export default pg_query;
