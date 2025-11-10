import express, { Router } from 'express';
import dotenv from 'dotenv';
// Controllers
import { createProjectController } from "../controllers/project.controller";
// Middlewares
import { authControl } from "../middlewares/auth.middleware";

// .env config
dotenv.config({ quiet: true })

const router: Router = express.Router();

// Reset Route
router.post('/project/create', authControl, createProjectController);
// router.get('/project/get', authControl, createProjectController);

export default router;