import { Request, Response } from 'express';
// Services
import loginService from "../services/login.service";
// Utils
import { resTryCatch } from '../utils/customErrorHandlers.util';

const loginController = async (req: Request, res: Response) => {

  // Datas
  const { username, password } = req.body;

  await resTryCatch(
    { file: "logins", level: "RESPONSE", logType: "login", service: "login.service" },
    req,
    res,
    () => loginService(username, password)
  );
};

export default loginController;