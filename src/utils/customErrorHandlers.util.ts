import { Request, Response } from 'express';
// Types
import { authResponseType } from "../types/responses.type";
import { levelType } from "../types/logger.type";
// Middlewares
import { logger } from "../middlewares/logger.middleware";
// Errors
import { statusCodeErrors } from "./customErrors.util";
import { hashURLToken } from './urlTokens.util';

export const resTryCatch = async <Args extends any[]>(
  loggerValue: {
    file: string,
    level: levelType,
    logType: string,
    service: string
  },
  req: Request,
  res: Response,
  func: (...args: Args) => Promise<authResponseType>,
  ...args: Args): Promise<void> => {

  // For performance
  const initialPeriod = performance.now();

  // Logger
  const logg2r = new logger();

  try {
    const { response, userId, HTTPStatusCode }: authResponseType = await func(...args);
    res.status(HTTPStatusCode).json(response);

    // Logger - RESPONSE
    logg2r.create({
      timestamp: new Date(),
      level: loggerValue.level,
      logType: loggerValue.logType,
      message: response.message,
      service: loggerValue.service,
      userID: req.method === "POST" ? req.body?.userID : req.params?.userID,
      token: req.query.token && hashURLToken((req.query.token).toString()).slice(0, 16),
      username: req.body?.username,
      ip: req.ip,
      endpoint: (req.url).includes("resetPassword") || (req.url).includes("verify")
        ? (req.url).split("?", 1).toString()
        : `/${(req.url).split("/")[1].toString()}`,
      method: req.method,
      userAgent: req.get('user-agent'),
      statusCode: HTTPStatusCode,
      durationMs: performance.now() - initialPeriod,
    }, { file: loggerValue.file, seeLogConsole: true });
  } catch (error: any) {
    if (error instanceof statusCodeErrors) {
      res.status(error.statusCode).json({
        message: error.message,
      });

      // Logger - RESPONSE
      logg2r.create({
        timestamp: new Date(),
        level: loggerValue.level,
        logType: loggerValue.logType,
        message: error.message,
        service: loggerValue.service,
        userID: req.method === "POST" ? req.body?.userID : req.params?.userID,
        token: req.query.token && hashURLToken((req.query.token).toString()).slice(0, 16),
        username: req.body?.username,
        ip: req.ip,
        endpoint: (req.url).includes("resetPassword") || (req.url).includes("verify")
          ? (req.url).split("?", 1).toString()
          : `/${(req.url).split("/")[1].toString()}`,
        method: req.method,
        userAgent: req.get('user-agent'),
        statusCode: error.statusCode,
        durationMs: performance.now() - initialPeriod,
        details: {
          error: "STATCODEERROR",
          stack: error.stack
        }
      }, { file: loggerValue.file, seeLogConsole: true })
    } else {
      res.status(500).json({
        message: "Server error!",
      });

      // Logger - RESPONSE
      logg2r.create({
        timestamp: new Date(),
        level: loggerValue.level,
        logType: loggerValue.logType,
        message: error.message,
        service: loggerValue.service,
        userID: req.method === "POST" ? req.body?.userID : req.params?.userID,
        token: req.query.token && hashURLToken((req.query.token).toString()).slice(0, 16),
        username: req.body?.username,
        ip: req.ip,
        endpoint: (req.url).includes("resetPassword") || (req.url).includes("verify")
          ? (req.url).split("?", 1).toString()
          : `/${(req.url).split("/")[1].toString()}`,
        method: req.method,
        userAgent: req.get('user-agent'),
        statusCode: 500,
        durationMs: performance.now() - initialPeriod,
        details: {
          error: "SERVERERROR",
          stack: error.stack
        }
      }, { file: loggerValue.file, seeLogConsole: true });
      throw error;
    }
  };
};