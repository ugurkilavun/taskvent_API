import { Request, Response } from 'express';
// Services
import { createProject } from "../services/project.service";
// Errors
import { statusCodeErrors } from "../utils/customErrors.util";
// Middlewares
import { logger } from "../middlewares/logger.middleware";
// Types
import { authResponseType } from "../types/responses.type";

export const createProjectController = async (req: Request, res: Response) => {
  // For performance
  const initialPeriod = performance.now();

  // Datas
  const token: string = req.headers.authorization.split(" ")[1];
  const { name, description, tags, userID }: { name: string, description: string, tags: Array<string>, userID: string } = req.body;

  // Logger
  const logg2r = new logger();

  try {

    const { response, userId }: authResponseType = await createProject(name, description, tags, userID);
    res.status(201).json(response);

    // Logger - RESPONSE
    logg2r.create({
      timestamp: new Date(),
      level: "RESPONSE",
      logType: "project",
      message: response.message,
      service: "project.service",
      userID: userId,
      ip: req.ip,
      endpoint: req.url,
      method: req.method,
      userAgent: req.get('user-agent'),
      statusCode: 201,
      durationMs: performance.now() - initialPeriod,
    }, { file: "projects", seeLogConsole: true });

  } catch (error: any) {
    if (error instanceof statusCodeErrors) {
      res.status(error.statusCode).json({
        message: error.message,
      });

      // Logger - RESPONSE
      logg2r.create({
        timestamp: new Date(),
        level: "RESPONSE",
        logType: "project",
        message: error.message,
        service: "project.service",
        token: token,
        ip: req.ip,
        endpoint: req.url,
        method: req.method,
        userAgent: req.get('user-agent'),
        statusCode: error.statusCode,
        durationMs: performance.now() - initialPeriod,
        details: {
          error: "STATCODEERROR",
          stack: `Error: ${error.stack}`
        }
      }, { file: "projects", seeLogConsole: true });
    } else if (error instanceof SyntaxError) {
      res.status(500).json({
        message: error.message,
      });

      // Logger - RESPONSE
      logg2r.create({
        timestamp: new Date(),
        level: "RESPONSE",
        logType: "project",
        message: error.message,
        service: "project.service",
        token: token,
        ip: req.ip,
        endpoint: req.url,
        method: req.method,
        userAgent: req.get('user-agent'),
        statusCode: 500,
        durationMs: performance.now() - initialPeriod,
        details: {
          error: "SYNTAXERROR",
          stack: `Error: ${error.stack}`
        }
      }, { file: "projects", seeLogConsole: true });
    } else {
      res.status(500).json({
        message: "Server error.",
      });

      // Logger - RESPONSE
      logg2r.create({
        timestamp: new Date(),
        level: "RESPONSE",
        logType: "project",
        message: error.message,
        service: "project.service",
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
      }, { file: "projects", seeLogConsole: true });
      throw error;
    }
  }
};