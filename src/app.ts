import express, { Application } from 'express';
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

// .env config
dotenv.config({ quiet: true });

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

export default app;