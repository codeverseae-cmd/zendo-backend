import jwt, { SignOptions } from "jsonwebtoken";
import config from "../config/config";

export const generateToken = (email: string): string => {
  const payload = { email };
  const secret = config.jwtSecret;
  const options: SignOptions = {
    expiresIn: config.jwtExpire as any,
  };

  return jwt.sign(payload, secret, options);
};