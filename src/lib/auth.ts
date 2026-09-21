import { db } from "@/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const aut = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
});
