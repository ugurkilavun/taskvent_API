import express, { Router } from 'express';
import dotenv from 'dotenv';
// Controllers
import loginController from "../controllers/loginController";

// .env config
dotenv.config({ quiet: true })

const router: Router = express.Router();

// Login Route
router.post('/login', loginController);

export default router;