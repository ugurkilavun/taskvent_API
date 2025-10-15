import express, { Router } from 'express';
import dotenv from 'dotenv';
// Controllers
import registerController from "../controllers/registerController";

// .env config
dotenv.config({ quiet: true })

const router: Router = express.Router();

// Login Route
router.post('/register', registerController);

export default router;