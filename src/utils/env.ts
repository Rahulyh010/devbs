import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

// Define the schema for environment variables
const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  JWT_SECRET: z.string().min(1, "JWT secret is required"),
  REFRESH_SECRET: z.string().min(1, "Refresh secret is required"),
  CLIENT_URL: z.string().min(1, "Client URL is required").optional(),
  SMARTPING_API_KEY: z.string().min(1, "Smartping API key is required"),
});

// Validate environment variables
const env = {
  ...envSchema.safeParse(process.env),
  accessTokenExpiry: "5m",
  refreshTokenExpiry: "7d",
};
// accessTokenExpiry: z.string().min(1, "Access token expiry is required"),
// refreshTokenExpiry: z.string().min(1, "Refresh token expiry is required"),

if (!env.success) {
  throw new Error(`Invalid environment variables: ${env.error.message}`);
}

export default env.data;
