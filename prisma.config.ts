import path from "node:path";
import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL!;

export default defineConfig({
  earlyAccess: true,
  schema: path.join("prisma", "schema.prisma"),
  migrate: {
    url: connectionString,
  },
  studio: {
    adapter: async () => {
      const { PrismaPg } = await import("@prisma/adapter-pg");
      const { default: pg } = await import("pg");
      const pool = new pg.Pool({ connectionString });
      return new PrismaPg(pool);
    },
  },
});
