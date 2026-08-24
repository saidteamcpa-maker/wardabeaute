import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString =
  process.env.DATABASE_URL ?? 'postgres://localhost:5432/warda_local';

// Reuse the client across hot-reloads in dev to avoid exhausting connections.
const globalForDb = globalThis as unknown as {
  __pgClient?: ReturnType<typeof postgres>;
};

const client =
  globalForDb.__pgClient ?? postgres(connectionString, { max: 5 });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.__pgClient = client;
}

export const db = drizzle(client, { schema });
export { schema };
