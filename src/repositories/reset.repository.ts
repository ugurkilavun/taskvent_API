// Models
import reset from "../models/reset.model";
// Types
import { verifyType } from "../types/verify.type";

export const insertReset = async (DATA: verifyType): Promise<any> => {
  return await reset.insertOne({
    id: DATA.id,
    token: DATA.token,
    expiresAt: DATA.expiresAt,
    used: DATA.used,
  });
};

export const findReset = async (token: string): Promise<any> => {
  return await reset.findOne({
    token: token,
  });
};

export const updateReset = async (id: string, token: string): Promise<any> => {
  return await reset.updateOne({
    id: id,
    token: token,
  }, { $set: { used: true } });
};