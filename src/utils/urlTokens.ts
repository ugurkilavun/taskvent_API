import crypto, { createHash } from "node:crypto";

export const generateURLToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const hashURLToken = (token: string): string => {
  return createHash('sha256')
    .update(token)
    .digest('hex');
};

// Secure comparison
export const verifyURLToken = (a: string, b: string): boolean => {
  const bufA = Buffer.from(a, 'hex');
  const bufB = Buffer.from(b, 'hex');
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
};