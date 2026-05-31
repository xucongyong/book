import pg_query from "@/lib/pg";

export interface SiteConfig {
  id: string;
  domain: string;
  name: string;
  description?: string;
  language: string; // 'en' | 'zh'
  theme?: string;
}

// Mock data for demonstration until DB table is created
const MOCK_SITES: Record<string, SiteConfig> = {
  "test.local": {
    id: "site-123",
    domain: "test.local",
    name: "Test Tenant Site",
    description: "This is a local test site",
    language: "en"
  },
  "demo.shipany.ai": {
    id: "site-demo",
    domain: "demo.shipany.ai",
    name: "ShipAny Demo",
    language: "en"
  }
};

export async function getSiteByDomain(domain: string): Promise<SiteConfig | null> {
  // Normalize domain: remove port if present (e.g. "test.local:3000" -> "test.local")
  const normalizedDomain = domain.split(':')[0];

  // Try to fetch from Postgres
  try {
    const rows = await pg_query('SELECT * FROM sites WHERE domain = $1 LIMIT 1', [normalizedDomain]);
    if (rows && rows.length > 0) {
      return rows[0] as SiteConfig;
    }
  } catch (e) {
    // console.warn("Error fetching site from DB, falling back to mock:", e);
  }

  // Fallback to Mock
  if (MOCK_SITES[normalizedDomain]) {
    return MOCK_SITES[normalizedDomain];
  }

  // Fallback for development: if domain is NOT found but starts with 'site-', return a generated one
  if (process.env.NODE_ENV === 'development' && normalizedDomain.startsWith('site-')) {
     return {
         id: normalizedDomain,
         domain: normalizedDomain,
         name: `Auto Generated ${normalizedDomain}`,
         language: "en"
     }
  }

  return null;
}
