import { Request, Response } from 'express';
// Services
import registerService from "../services/register.service";
// Errors
import { statusCodeErrors } from "../utils/statusCodeErrors.util";
// Types
import { authResponseType } from "../types/responses.type";
// Middlewares
import { logger } from "../middlewares/logger.middleware";

const registerController = async (req: Request, res: Response) => {
  // For performance
  const initialPeriod = performance.now();

  // Datas
  const { firstname, lastname, username, email, password, dateOfBirth, country } = req.body;

  // Logger
  const logg2r = new logger();

  try {
    const { response, userId }: authResponseType = await registerService({ firstname, lastname, username, email, password, dateOfBirth, country });
    res.status(201).json(response);

    // Logger - RESPONSE
    logg2r.create({
      timestamp: new Date(),
      level: "RESPONSE",
      logType: "register",
      message: response.message,
      service: "register.service",
      userID: userId,
      ip: req.ip,
      endpoint: "/register",
      method: req.method,
      userAgent: req.get('user-agent'),
      statusCode: 201,
      durationMs: performance.now() - initialPeriod,
    }, { file: "registers", seeLogConsole: true });

  } catch (error: any) {
    if (error instanceof statusCodeErrors) {
      res.status(error.statusCode).json({
        message: error.message,
      });

      // Logger - RESPONSE
      logg2r.create({
        timestamp: new Date(),
        level: "RESPONSE",
        logType: "register",
        message: error.message,
        service: "register.service",
        username: req.body?.username,
        ip: req.ip,
        endpoint: "/register",
        method: req.method,
        userAgent: req.get('user-agent'),
        statusCode: error.statusCode,
        durationMs: performance.now() - initialPeriod,
        details: {
          error: "STATCODEERROR",
          stack: `Error: ${error.stack}`
        }
      }, { file: "registers", seeLogConsole: true });
    } else if (error instanceof SyntaxError) {
      res.status(500).json({
        message: error.message,
      });

      // Logger - RESPONSE
      logg2r.create({
        timestamp: new Date(),
        level: "RESPONSE",
        logType: "registers",
        message: error.message,
        service: "register.service",
        username: req.body?.username,
        ip: req.ip,
        endpoint: "/register",
        method: req.method,
        userAgent: req.get('user-agent'),
        statusCode: 500,
        durationMs: performance.now() - initialPeriod,
        details: {
          error: "SYNTAXERROR",
          stack: `Error: ${error.stack}`
        }
      }, { file: "registers", seeLogConsole: true });
    } else {
      res.status(500).json({
        message: "Server error!",
      });

      // Logger - RESPONSE
      logg2r.create({
        timestamp: new Date(),
        level: "RESPONSE",
        logType: "register",
        message: error.message,
        service: "register.service",
        username: req.body?.username,
        ip: req.ip,
        endpoint: "/register",
        method: req.method,
        userAgent: req.get('user-agent'),
        statusCode: 500,
        durationMs: performance.now() - initialPeriod,
        details: {
          error: "SERVERERROR",
          stack: `Error: ${error.stack}`
        }
      }, { file: "registers", seeLogConsole: true });
      throw error; // unknown error (*_*)
    }
  }
};

export default registerController;