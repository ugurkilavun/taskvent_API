import express, { Router } from 'express';
import dotenv from 'dotenv';
// Controllers
import verifyController from "../controllers/verify.controller";

// .env config
dotenv.config({ quiet: true })

const router: Router = express.Router();

// Login Route
router.get('/verify', verifyController);

export default router;