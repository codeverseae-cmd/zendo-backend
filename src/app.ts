import express from "express";
// import helmet from 'helmet';
import cors from "cors";
import { rootRouter } from "./routes/index";
import { notFoundHandler } from "./middlewares/notFoundHandler";
import { errorHandler } from "./middlewares/errorHandler";

export const createApp = () => {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  // app.use(helmet());
  app.use(cors());

  // Raw body MUST be registered before express.json() so that the webhook
  // handler receives the unparsed Buffer needed for HMAC-SHA256 verification.
  app.use(
    "/api/orders/webhook/tabby",
    express.raw({ type: "application/json" })
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.use("/api", rootRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
