import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
// Middlewares
import { logger } from './logger.middleware';

export const authControl = async (req: Request, res: Response, next: NextFunction) => {
  // For performance
  const initialPeriod = performance.now();

  // Datas
  const token: string = req.headers.authorization.split(" ")[1];

  // Logger
  const logg2r = new logger();

  try {
    const decoded: any = jwt.verify(token, process.env.ACCESS_SECRET);
    req.body.userID = decoded.id;

    // Logger - AUDIT
    logg2r.create({
      timestamp: new Date(),
      level: "AUDIT",
      logType: "auth",
      message: "Valid token.",
      service: "auth.middleware",
      userID: decoded.id,
      ip: req.ip,
      endpoint: req.url,
      method: req.method,
      userAgent: req.get('user-agent'),
      durationMs: performance.now() - initialPeriod,
    }, { file: "auths", seeLogConsole: true });

    next();
  } catch (error: any) {
    if (error instanceof TokenExpiredError) {
      logg2r.create({
        timestamp: new Date(),
        level: "RESPONSE",
        logType: "auth",
        message: error.message,
        service: "auth.middleware",
        token: token,
        ip: req.ip,
        endpoint: req.url,
        method: req.method,
        userAgent: req.get('user-agent'),
        statusCode: 401,
        durationMs: performance.now() - initialPeriod,
        details: {
          error: "AUTHERROR",
          stack: `Error: ${error.stack}`
        }
      }, { file: "auths", seeLogConsole: true });

      return res.status(401).json({
        message: "JWT is invalid or expired."
      });
    } else {
      // Logger - RESPONSE
      logg2r.create({
        timestamp: new Date(),
        level: "RESPONSE",
        logType: "auth",
        message: error.message,
        service: "auth.middleware",
        token: token,
        ip: req.ip,
        endpoint: req.url,
        method: req.method,
        userAgent: req.get('user-agent'),
        statusCode: 401,
        durationMs: performance.now() - initialPeriod,
        details: {
          error: "AUTHERROR",
          stack: `Error: ${error.stack}`
        }
      }, { file: "auths", seeLogConsole: true });

      return res.status(500).json({
        message: "Server error."
      });
    }
  }
};