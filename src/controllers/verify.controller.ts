import { Request, Response } from 'express';
// Services
import verifyService from "../services/verify.service";
// Utils
import { resTryCatch } from '../utils/customErrorHandlers.util';

const verifyController = async (req: Request, res: Response) => {

  // Data
  const token: string = req.query.token.toString();

  await resTryCatch(
    { file: "verifications", level: "RESPONSE", logType: "verify", service: "verify.service" },
    req,
    res,
    () => verifyService(token)
  );
};

export default verifyController;