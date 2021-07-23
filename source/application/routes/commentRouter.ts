import express from 'express';
import { CommentController } from '../controllers/CommentController';
export const commentRouter = express.Router();
import validateToken from '../middleware/validateJWT';

commentRouter.get('/comments', validateToken, CommentController.getByDate);

commentRouter.post(
	'/comments',
	validateToken,
	CommentController.verifyPayload,
	CommentController.create
);

commentRouter.put(
	'/comments/:id',
	validateToken,
	CommentController.verifyPayload,
	CommentController.update
);

commentRouter.delete('/comments/:id', validateToken, CommentController.delete);
