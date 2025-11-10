import express, { Router } from 'express';
import dotenv from 'dotenv';
// Controllers
import { refreshController } from "../controllers/refresh.controller";

// .env config
dotenv.config({ quiet: true })

const router: Router = express.Router();

// Refresh Route
router.post('/refresh', refreshController);

export default router;