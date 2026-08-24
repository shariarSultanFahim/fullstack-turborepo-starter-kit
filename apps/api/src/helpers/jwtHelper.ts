/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

const createToken = (payload: object, secret: Secret, expireTime: string | number): string => {
  const options: SignOptions = { expiresIn: expireTime as any };
  return jwt.sign(payload, secret as string, options);
};

const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret as string) as JwtPayload;
};

export const jwtHelper = { createToken, verifyToken };
