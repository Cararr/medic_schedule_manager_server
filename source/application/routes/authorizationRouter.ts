import express from 'express';
import { LoginController } from '../controllers/LoginController';
import validateToken from '../middleware/validateJWT';
export const authorizationRouter = express.Router();

authorizationRouter.get('/validate', validateToken);
authorizationRouter.post('/login', LoginController.login);
