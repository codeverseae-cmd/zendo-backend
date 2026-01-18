import { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import config from "../config/config";
import { generateToken } from "../utils/generateToken";

export const adminLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (email !== config.adminEmail || password !== config.adminPassword) {
    throw new AppError({
      message: "Invalid credentials",
      statusCode: 401,
      code: "INVALID_ADMIN_LOGIN",
    });
  }

  const token = generateToken(email);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    token,
  });
};