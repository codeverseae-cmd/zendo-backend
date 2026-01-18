import dotenv from "dotenv";

const env = process.env.NODE_ENV ?? "development";
const isTest = env === "test";

if (!isTest) {
  dotenv.config();
}

const config: {
  env: string;
  isDev: boolean;
  isProd: boolean;
  port: number;
  logLevel: string;
  adminEmail: string | undefined;
  adminPassword: string | undefined;
  jwtSecret: string;
  jwtExpire: string;
} = {
  env,
  isDev: env === "development",
  isProd: env === "production",
  port: Number.parseInt(process.env.PORT ?? "4000", 10),
  logLevel: process.env.LOG_LEVEL ?? "info",
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  jwtSecret: process.env.JWT_SECRET ?? "secret",
  jwtExpire: process.env.JWT_EXPIRE ?? "7d",
};

export type AppConfig = typeof config;

export default config;
