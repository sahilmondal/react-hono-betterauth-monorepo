import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";
import path from "path";
import { fileURLToPath } from "url";

// Resolves __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cascade load environment variables:
// 1. Current package directory (.env)
dotenv.config({ path: path.resolve(__dirname, ".env") });
// 2. Workspace root directory (.env)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
// 3. Backend API directory (.env)
// dotenv.config({ path: path.resolve(__dirname, "../../api/http-api/.env") });

export default defineConfig({
  out: "./drizzle",
  schema: "./src/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
