import http from "node:http";
import config from "./config/config";
import { createApp } from "./app";
import logger from "./config/logger";
import { connectDB } from "./config/db";

const app = createApp();

const server = http.createServer(app);

(async () => {
  await connectDB();
  server.listen(config.port, () => {
    logger.info(
      `Server listening on port ${config.port} in ${config.env} mode`
    );
  });
})();

const shutdown = (signal: NodeJS.Signals) => {
  logger.info(`Received ${signal}. Closing server...`);
  server.close(() => {
    logger.info("HTTP server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
