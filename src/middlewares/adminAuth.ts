import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { AppError } from "../utils/AppError";

export const adminAuth = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError({ message: "Unauthorized", statusCode: 401 });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new AppError({ message: "Unauthorized", statusCode: 401 });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    (req as any).admin = decoded;
    next();
  } catch (err) {
    throw new AppError({ message: "Invalid token", statusCode: 401 });
  }
};
