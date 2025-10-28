import { Request, Response } from 'express';
// Services
import verifyService from "../services/verifyService";
// Errors
import { statusCodeErrors } from "../utils/statusCodeErrors";
// Middlewares
import { logger } from "../middlewares/logger";
// Types
import { authResponseType } from "../types/responses";

const loginController = async (req: Request, res: Response) => {
  // For performance
  const initialPeriod = performance.now();

  // Data
  const token: string = req.query.token.toString();

  // Logger
  const logg2r = new logger();

  try {
    const { response, userId }: authResponseType = await verifyService(token);

    res.status(200).json(response);

    // Logger - RESPONSE
    logg2r.create({
      timestamp: new Date(),
      level: "RESPONSE",
      logType: "verify",
      message: response.message,
      service: "verify.service",
      userID: userId,
      ip: req.ip,
      endpoint: "/verify",
      method: req.method,
      userAgent: req.get('user-agent'),
      statusCode: 200,
      durationMs: performance.now() - initialPeriod,
    }, { file: "verifications", seeLogConsole: true });

  } catch (error: any) {
    if (error instanceof statusCodeErrors) {
      res.status(error.statusCode).json({
        message: error.message,
      });

      // Logger - RESPONSE
      logg2r.create({
        timestamp: new Date(),
        level: "RESPONSE",
        logType: "verify",
        message: "Status code error!",
        service: "verify.service",
        token: `${token.slice(0, 16)}...`,
        ip: req.ip,
        endpoint: "/verify",
        method: req.method,
        userAgent: req.get('user-agent'),
        statusCode: error.statusCode,
        durationMs: performance.now() - initialPeriod,
        details: {
          error: "STATCODEERROR",
          stack: `Error: ${error.message}`
        }
      }, { file: "verifications", seeLogConsole: true });
    } else if (error instanceof SyntaxError) {
      res.status(500).json({
        message: "Server error!",
      });

      // Logger - RESPONSE
      logg2r.create({
        timestamp: new Date(),
        level: "RESPONSE",
        logType: "verify",
        message: "Syntax error!",
        service: "verify.service",
        token: `${token.slice(0, 16)}...`,
        ip: req.ip,
        endpoint: "/verify",
        method: req.method,
        userAgent: req.get('user-agent'),
        statusCode: 500,
        durationMs: performance.now() - initialPeriod,
        details: {
          error: "SYNTAXERROR",
          stack: `Error: ${error.message}`
        }
      }, { file: "verifications", seeLogConsole: true });
    } else {
      console.log("[Error]", error.message);
      res.status(500).json({
        message: "Server error!",
      });

      // Logger - RESPONSE
      logg2r.create({
        timestamp: new Date(),
        level: "RESPONSE",
        logType: "verify",
        message: "Server error!",
        service: "verify.service",
        token: `${token.slice(0, 16)}...`,
        ip: req.ip,
        endpoint: "/verify",
        method: req.method,
        userAgent: req.get('user-agent'),
        statusCode: 500,
        durationMs: performance.now() - initialPeriod,
        details: {
          error: "SERVERERROR",
          stack: `Error: ${error.message}`
        }
      }, { file: "verifications", seeLogConsole: true });
      throw error;
    }
  }
};

export default loginController;