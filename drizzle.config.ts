import "dotenv/config";
import { Config } from "drizzle-kit";

export default {
  out: "./drizzle",
  schema: "./src/lib/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL! || "",
  },
  verbose: true,
  strict: true,
} satisfies Config;
