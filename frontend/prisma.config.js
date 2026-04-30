import { defineConfig } from "prisma/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://leslie:leslie@localhost:5432/mydatabase",
    adapter: () => {
      const pool = new Pool({
        connectionString:
          process.env.DATABASE_URL ??
          "postgresql://leslie:leslie@localhost:5432/mydatabase",
      });
      return new PrismaPg(pool);
    },
  },
});
