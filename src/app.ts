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
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.use("/api", rootRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
