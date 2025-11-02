import express, { Application, Request, Response } from 'express';
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from 'dotenv';
// Configs
import connectDB from "./configs/db.config";
import { createFiles } from "./configs/createFiles.config";
// Pages
import login from "./routes/login.route";
import register from "./routes/register.route";
import verify from "./routes/verify.route";
import reset from "./routes/reset.route";
// Middlewares
import { logger } from "./middlewares/logger.middleware";

// .env config
dotenv.config({ quiet: true });

// Logger
const logg2r = new logger();

// Creating directories and files
createFiles();

// Database Connection
connectDB();

const app: Application = express();

app.use(bodyParser.json()); // To accept JSON data
// CORS
app.use(cors({ origin: "*" })); // Permitted URLs

// Router usage area
app.use('/', login);
app.use('/', register);
app.use('/', verify);
app.use('/', reset);

// https://expressjs.com/en/guide/error-handling.html
app.use((error: Error, req: Request, res: Response, next: any) => {
  logg2r.create({
    timestamp: new Date(),
    level: "RESPONSE",
    logType: "server",
    message: error.message,
    service: "app",
    ip: req.ip,
    endpoint: "/",
    method: req.method,
    userAgent: req.get('user-agent'),
    statusCode: 500,
    details: {
      error: "ANYERROR",
      stack: `Error: ${error.stack}`
    }
  }, { file: "server", seeLogConsole: true });
  res.status(500).send({ message: "Something broke!" });
})

export default app;