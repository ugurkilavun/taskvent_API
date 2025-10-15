import { Request, Response } from 'express';
// Services
import loginService from "../services/loginService";
// Errors
import { statusCodeErrors } from "../utils/statusCodeErrors";

const loginController = async (req: Request, res: Response) => {
  const { username_or_email, password } = req.body;

  try {
    const value: object = await loginService(username_or_email, password);
    res.status(200).json(value);

  } catch (error: any) {
    if (error instanceof statusCodeErrors) {
      console.log(`[Status Code Error - ${error.statusCode}]`, error.message);
      res.status(error.statusCode).json({
        message: error.message,
      });
    } else if (error instanceof SyntaxError) {
      console.log("[JSON Syntax Error]:", error.message);
      res.status(500).json({
        message: "Server error!",
      });
    } else {
      console.log("[Error]", error.message);
      res.status(500).json({
        message: "Server error!",
      });
      throw error;
    }
  }
};

export default loginController;