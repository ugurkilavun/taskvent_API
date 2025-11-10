import { Request, Response } from 'express';
// Services
import { forgotPassword, resetPassword } from "../services/reset.service";
// Utils
import { statusCodeErrors } from "../utils/customErrors.util"; // Error
import { hashURLToken } from '../utils/urlTokens.util';
// Middlewares
import { logger } from "../middlewares/logger.middleware";
// Types
import { authResponseType } from "../types/responses.type";

export const forgotPasswordController = async (req: Request, res: Response) => {
  // For performance
  const initialPeriod = performance.now();

  // Datas
  const { email } = req.body;

  // Logger
  const logg2r = new logger();

  try {

    const { response, userId }: authResponseType = await forgotPassword(email);

    res.status(200).json(response);

    // Logger - RESPONSE
    logg2r.create({
      timestamp: new Date(),
      level: "RESPONSE",
      logType: "forgotpassword",
      message: response.message,
      service: "reset.service",
      userID: userId,
      ip: req.ip,
      endpoint: "/forgotPassword",
      method: req.method,
      userAgent: req.get('user-agent'),
      statusCode: 200,
      durationMs: performance.now() - initialPeriod,
    }, { file: "resets", seeLogConsole: true });

  } catch (error: any) {
    if (error instanceof statusCodeErrors) {
      res.status(error.statusCode).json({
        message: error.message,
      });

      // Logger - RESPONSE
      logg2r.create({
        timestamp: new Date(),
        level: "RESPONSE",
        logType: "forgotpassword",
        message: "Status code error",
        service: "reset.service",
        username: req.body?.email,
        ip: req.ip,
        endpoint: "/forgotPassword",
        method: req.method,
        userAgent: req.get('user-agent'),
        statusCode: 400,
        durationMs: performance.now() - initialPeriod,
        details: {
          error: "STATCODEERROR",
          stack: `Error: ${error.stack}`
        }
      }, { file: "resets", seeLogConsole: true });
    } else if (error instanceof SyntaxError) {
      res.status(500).json({
        message: error.message,
      });

      // Logger - RESPONSE
      logg2r.create({
        timestamp: new Date(),
        level: "RESPONSE",
        logType: "forgotpassword",
        message: error.message,
        service: "reset.service",
        username: req.body?.email,
        ip: req.ip,
        endpoint: "/forgotPassword",
        method: req.method,
        userAgent: req.get('user-agent'),
        statusCode: 500,
        durationMs: performance.now() - initialPeriod,
        details: {
          error: "SYNTAXERROR",
          stack: `Error: ${error.stack}`
        }
      }, { file: "resets", seeLogConsole: true });
    } else {
      res.status(500).json({
        message: "Server error!",
      });

      // Logger - RESPONSE
      logg2r.create({
        timestamp: new Date(),
        level: "RESPONSE",
        logType: "forgotpassword",
        message: error.message,
        service: "reset.service",
        username: req.body?.email,
        ip: req.ip,
        endpoint: "/forgotPassword",
        method: req.method,
        userAgent: req.get('user-agent'),
        statusCode: 500,
        durationMs: performance.now() - initialPeriod,
        details: {
          error: "SERVERERROR",
          stack: `Error: ${error.stack}`
        }
      }, { file: "resets", seeLogConsole: true });
      throw error;
    }
  }
};

export const resetPasswordController = async (req: Request, res: Response) => {
  // For performance
  const initialPeriod = performance.now();

  // Datas
  const token: any = req.query.token;
  const hashedToken = hashURLToken(token);

  const { password, rePassword }: any = req.body;

  // Logger
  const logg2r = new logger();

  try {

    const { response, userId }: authResponseType = await resetPassword(hashedToken, password, rePassword);
    res.status(200).json(response);

    // Logger - RESPONSE
    logg2r.create({
      timestamp: new Date(),
      level: "RESPONSE",
      logType: " resetpassword",
      message: response.message,
      service: "reset.service",
      userID: userId,
      ip: req.ip,
      endpoint: "/resetPassword",
      method: req.method,
      userAgent: req.get('user-agent'),
      statusCode: 200,
      durationMs: performance.now() - initialPeriod,
    }, { file: "resets", seeLogConsole: true });

  } catch (error: any) {
    if (error instanceof statusCodeErrors) {
      res.status(error.statusCode).json({
        message: error.message,
      });

      // Logger - RESPONSE
      logg2r.create({
        timestamp: new Date(),
        level: "RESPONSE",
        logType: "resetpassword",
        message: error.message,
        service: "reset.service",
        token: hashedToken,
        ip: req.ip,
        endpoint: "/resetPassword",
        method: req.method,
        userAgent: req.get('user-agent'),
        statusCode: 400,
        durationMs: performance.now() - initialPeriod,
        details: {
          error: "STATCODEERROR",
          stack: `Error: ${error.stack}`
        }
      }, { file: "resets", seeLogConsole: true });
    } else if (error instanceof SyntaxError) {
      res.status(500).json({
        message: error.message,
      });

      // Logger - RESPONSE
      logg2r.create({
        timestamp: new Date(),
        level: "RESPONSE",
        logType: "resetpassword",
        message: error.message,
        service: "reset.service",
        token: hashedToken,
        ip: req.ip,
        endpoint: "/resetPassword",
        method: req.method,
        userAgent: req.get('user-agent'),
        statusCode: 500,
        durationMs: performance.now() - initialPeriod,
        details: {
          error: "SYNTAXERROR",
          stack: `Error: ${error.stack}`
        }
      }, { file: "resets", seeLogConsole: true });
    } else {
      res.status(500).json({
        message: "Server error!",
      });

      // Logger - RESPONSE
      logg2r.create({
        timestamp: new Date(),
        level: "RESPONSE",
        logType: "resetpassword",
        message: error.message,
        service: "reset.service",
        token: hashedToken,
        ip: req.ip,
        endpoint: "/resetPassword",
        method: req.method,
        userAgent: req.get('user-agent'),
        statusCode: 500,
        durationMs: performance.now() - initialPeriod,
        details: {
          error: "SERVERERROR",
          stack: `Error: ${error.stack}`
        }
      }, { file: "resets", seeLogConsole: true });
      throw error;
    }
  }
};