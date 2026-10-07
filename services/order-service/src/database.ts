import { Pool } from "pg";

export const pool = new Pool({
  host: "postgres",
  port: 5432,
  database: "orderdb",
  user: "orderuser",
  password: "orderpassword",
});

pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL");
});

pool.on("error", (error) => {
  console.error("❌ PostgreSQL error:", error);
});