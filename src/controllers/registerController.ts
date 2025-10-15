import { Request, Response } from 'express';
// Services
import registerService from "../services/registerService";
// Errors
import { statusCodeErrors } from "../utils/statusCodeErrors";

const registerController = async (req: Request, res: Response) => {
  const { firstname, lastname, username, email, password, dateOfBirth, country } = req.body;

  try {
    const value: object = await registerService({ firstname, lastname, username, email, password, dateOfBirth, country });
    res.status(201).json(value);

  } catch (error: any) {
    if (error instanceof statusCodeErrors) {
      console.log(`[Status Code Error - ${error.statusCode}]`, error.name);
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
      throw error; // unknown error (*_*)
    }
  }
};

export default registerController;