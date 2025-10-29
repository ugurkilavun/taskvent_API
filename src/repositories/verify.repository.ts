// Models
import verify from "../models/verify.model";
// Types
import { verifyType } from "../types/verify.type";

export const insertVerify = async (DATA: verifyType): Promise<any> => {
  return await verify.insertOne({
    id: DATA.id,
    token: DATA.token,
    expiresAt: DATA.expiresAt,
    used: DATA.used,
  });
};

export const findVerify = async (token: string): Promise<any> => {
  return await verify.findOne({
    token: token,
  });
};

export const updateVerify = async (id: string, token: string): Promise<any> => {
  return await verify.updateOne({
    id: id,
    token: token,
  }, { $set: { used: true } });
};