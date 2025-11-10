import { Request, Response } from 'express';
// Services
import loginService from "../services/login.service";
// Errors
import { statusCodeErrors } from "../utils/customErrors.util";
// Middlewares
import { logger } from "../middlewares/logger.middleware";
// Types
import { authResponseType } from "../types/responses.type";

const loginController = async (req: Request, res: Response) => {
  // For performance
  const initialPeriod = performance.now();

  // Datas
  const { username, password } = req.body;

  // Logger
  const logg2r = new logger();

  try {

    const { response, userId }: authResponseType = await loginService(username, password);
    res.status(200).json(response);

    // Logger - RESPONSE
    logg2r.create({
      timestamp: new Date(),
      level: "RESPONSE",
      logType: "login",
      message: response.message,
      service: "login.service",
      userID: userId,
      ip: req.ip,
      endpoint: "/login",
      method: req.method,
      userAgent: req.get('user-agent'),
      statusCode: 200,
      durationMs: performance.now() - initialPeriod,
    }, { file: "logins", seeLogConsole: true });

  } catch (error: any) {
    if (error instanceof statusCodeErrors) {
      res.status(error.statusCode).json({
        message: error.message,
      });

      // Logger - RESPONSE
      logg2r.create({
        timestamp: new Date(),
        level: "RESPONSE",
        logType: "login",
        message: error.message,
        service: "login.service",
        username: req.body?.username,
        ip: req.ip,
        endpoint: "/login",
        method: req.method,
        userAgent: req.get('user-agent'),
        statusCode: error.statusCode,
        durationMs: performance.now() - initialPeriod,
        details: {
          error: "STATCODEERROR",
          stack: `Error: ${error.stack}`
        }
      }, { file: "logins", seeLogConsole: true });
    } else if (error instanceof SyntaxError) {
      res.status(500).json({
        message: error.message,
      });

      // Logger - RESPONSE
      logg2r.create({
        timestamp: new Date(),
        level: "RESPONSE",
        logType: "login",
        message: error.message,
        service: "login.service",
        username: req.body?.username,
        ip: req.ip,
        endpoint: "/login",
        method: req.method,
        userAgent: req.get('user-agent'),
        statusCode: 500,
        durationMs: performance.now() - initialPeriod,
        details: {
          error: "SYNTAXERROR",
          stack: `Error: ${error.stack}`
        }
      }, { file: "logins", seeLogConsole: true });
    } else {
      res.status(500).json({
        message: "Server error!",
      });

      // Logger - RESPONSE
      logg2r.create({
        timestamp: new Date(),
        level: "RESPONSE",
        logType: "login",
        message: error.message,
        service: "login.service",
        username: req.body?.username,
        ip: req.ip,
        endpoint: "/login",
        method: req.method,
        userAgent: req.get('user-agent'),
        statusCode: 500,
        durationMs: performance.now() - initialPeriod,
        details: {
          error: "SERVERERROR",
          stack: `Error: ${error.stack}`
        }
      }, { file: "logins", seeLogConsole: true });
      throw error;
    }
  }
};

export default loginController;