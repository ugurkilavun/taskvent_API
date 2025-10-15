import express, { Application } from 'express';
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from 'dotenv';
// Configs
import connectDB from "./configs/connectDB";
// Pages
import login from "./routes/login";
import register from "./routes/register";

// .env config
dotenv.config({ quiet: true })

// Database Connection
connectDB();

const app: Application = express();

app.use(bodyParser.json()); // To accept JSON data
// CORS
app.use(cors({ origin: "*" })); // Permitted URLs

// Router usage area
app.use('/', login);
app.use('/', register);

export default app;