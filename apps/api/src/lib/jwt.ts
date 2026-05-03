import type { JWTPayload } from "@luxero/types";
import jwt from "jsonwebtoken";

const PLACEHOLDER = "change-this-to-a-long-random-secret-in-production";
if (process.env.NODE_ENV === "production" && process.env.JWT_SECRET === PLACEHOLDER) {
  throw new Error("JWT_SECRET is still the placeholder value in production!");
}

const JWT_SECRET = (() => {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET environment variable is required in production");
  }
  return secret || "dev-secret-do-not-use-in-production";
})();
const JWT_EXPIRY = "7d";

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}
