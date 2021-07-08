import express from 'express';
import { LoginController } from '../controllers/LoginController';
export const loginRouter = express.Router();

loginRouter.post(
	'/login',
	LoginController.verifyPayload,
	LoginController.login
);
