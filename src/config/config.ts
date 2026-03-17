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
  tabbyPublicKey: string;
  tabbySecretKey: string;
  tabbyMerchantCode: string;
  tabbyWebhookSecret: string;
  tamaraApiUrl: string;
  tamaraApiToken: string;
  tamaraWebhookSecret: string;
  tamaraNotificationToken: string;
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
  tabbyPublicKey: process.env.TABBY_PUBLIC_KEY ?? "",
  tabbySecretKey: process.env.TABBY_SECRET_KEY ?? "",
  tabbyMerchantCode: process.env.TABBY_MERCHANT_CODE ?? "",
  tabbyWebhookSecret: process.env.TABBY_WEBHOOK_SECRET ?? "",
  tamaraApiUrl: process.env.TAMARA_API_URL ?? "https://api.tamara.co",
  tamaraApiToken: process.env.TAMARA_API_TOKEN ?? "",
  tamaraWebhookSecret: process.env.TAMARA_WEBHOOK_SECRET ?? "",
  tamaraNotificationToken: process.env.TAMARA_NOTIFICATION_TOKEN ?? "",
};

export type AppConfig = typeof config;

export default config;
