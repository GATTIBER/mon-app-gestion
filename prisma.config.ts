import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Next.js reads `.env.local`; load the same file here so the CLI
// (migrate, studio, etc.) sees the same DATABASE_URL.
config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env["DATABASE_URL"]!,
  },
  migrations: {
    path: "prisma/migrations",
  },
});
