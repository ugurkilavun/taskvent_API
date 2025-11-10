import { Request, Response } from 'express';
import jwt, { TokenExpiredError } from "jsonwebtoken";
import dotenv from 'dotenv';
// Errors
import { statusCodeErrors } from "../utils/customErrors.util";
import { signToken } from '../utils/jwt.util';
// Middlewares
import { logger } from "../middlewares/logger.middleware";
// R<epositories
import { findById } from "../repositories/user.repository";

// .env config
dotenv.config({ quiet: true });

export const refreshController = async (req: Request, res: Response) => {
  // For performance
  const initialPeriod = performance.now();

  // Datas
  const token: string = req.body.token;

  // Logger
  const logg2r = new logger();

  try {
    const tokenDATA: any = jwt.verify(token, process.env.REFRESH_SECRET);

    const userDATAS: any = await findById(tokenDATA.id);
    if (!userDATAS) throw new statusCodeErrors("JWT is invalid or expired.", 401);

    const ACCESS_TOKEN: string = signToken({
      id: (userDATAS._id).toJSON(),
      username: userDATAS.username,
      created_at: new Date()
    },
      "access", '15m'
    ); // 15m

    res.status(200).json({
      message: "Token created.",
      access_token: ACCESS_TOKEN
    });

    // Logger - RESPONSE
    logg2r.create({
      timestamp: new Date(),
      level: "RESPONSE",
      logType: "refresh",
      message: "Token created.",
      service: "refresh.controller",
      token: token,
      ip: req.ip,
      endpoint: req.url,
      method: req.method,
      userAgent: req.get('user-agent'),
      statusCode: 200,
      durationMs: performance.now() - initialPeriod,
    }, { file: "refreshes", seeLogConsole: true });

  } catch (error: any) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        message: "JWT is invalid or expired."
      });

      // Logger - RESPONSE
      logg2r.create({
        timestamp: new Date(),
        level: "RESPONSE",
        logType: "refresh",
        message: error.message,
        service: "refresh.controller",
        token: token,
        ip: req.ip,
        endpoint: req.url,
        method: req.method,
        userAgent: req.get('user-agent'),
        statusCode: 401,
        durationMs: performance.now() - initialPeriod,
        details: {
          error: "TOKENERROR",
          stack: `Error: ${error.stack}`
        }
      }, { file: "refreshes", seeLogConsole: true });
    } else {
      res.status(500).json({
        message: "Server error.",
      });

      // Logger - RESPONSE
      logg2r.create({
        timestamp: new Date(),
        level: "RESPONSE",
        logType: "refresh",
        message: error.message,
        service: "refresh.controller",
        token: token,
        ip: req.ip,
        endpoint: req.url,
        method: req.method,
        userAgent: req.get('user-agent'),
        statusCode: 500,
        durationMs: performance.now() - initialPeriod,
        details: {
          error: "SERVERERROR",
          stack: `Error: ${error.stack}`
        }
      }, { file: "refreshes", seeLogConsole: true });
      throw error;
    }
  }
};