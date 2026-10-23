
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

dotenv.config();

// Neon may provide `channel_binding=require` in the connection string, but
// node-postgres on some Windows environments cannot establish that TLS mode.
// Prisma can still connect securely with sslmode=require.
if (process.env.DATABASE_URL) {
  const databaseUrl = new URL(process.env.DATABASE_URL);
  databaseUrl.searchParams.delete("channel_binding");
  databaseUrl.searchParams.set("sslmode", "verify-full");
  process.env.DATABASE_URL = databaseUrl.toString();
}

// Use the native pg driver instead of Prisma's Rust TLS engine. This avoids a
// Windows Schannel error while retaining TLS verification for Neon.
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: true },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;
