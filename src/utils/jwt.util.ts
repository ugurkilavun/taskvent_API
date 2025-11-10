import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// .env config
dotenv.config({ quiet: true })

export const signToken = (payload: object, secretType: string, expiresIn: any): string => {
  // secret type(s): refresh | access
  // * Varibles
  const header: any = { alg: "HS256", typ: "JWT" };
  const secret: string = secretType === "access" ? process.env.ACCESS_SECRET : process.env.REFRESH_SECRET;
  const token: string = jwt.sign(payload, secret, { header: header, expiresIn: expiresIn });

  return token;
};