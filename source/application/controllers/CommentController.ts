import { Request, Response, NextFunction } from 'express';
import { BadRequestError, NotFoundError } from 'routing-controllers';
import { getRepository } from 'typeorm';
import { validateDateFormat } from '../../../util/utilities';
import { Comment } from '../../domain/entities/Comment';

export class CommentController {
	static getByDate = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const date = req.query.date;
			if (!validateDateFormat(date))
				return res.status(400).send(new BadRequestError('Wrong date format'));

			const comment = await getRepository(Comment).findOne({
				where: { date },
			});
			res.send({ comment });
		} catch (error) {
			next(error);
		}
	};

	static create = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const commentsRepository = getRepository(Comment);
			const oldComment = await commentsRepository.findOne(req.body.comment);

			if (oldComment)
				return res
					.status(400)
					.send(
						new BadRequestError('There is already a comment for a given data.')
					);

			const newComment = commentsRepository.create(req.body.comment);

			const response = await commentsRepository.save(newComment);
			res.status(201).send({ message: 'Created.', comment: response });
		} catch (error) {
			next(error);
		}
	};

	static update = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const commentsRepository = getRepository(Comment);

			const oldComment = await commentsRepository.findOne(req.params.id);

			if (!oldComment)
				return res.status(404).send(new NotFoundError('Comment not found.'));

			if (oldComment.date !== req.body.comment.date)
				return res
					.status(400)
					.send(new NotFoundError("Comment's date can't be changed."));

			await commentsRepository.update(oldComment.id, req.body.comment);

			const comment = await commentsRepository.findOne(oldComment.id);

			res.send({
				message: 'Updated.',
				comment,
			});
		} catch (error) {
			next(error);
		}
	};

	static verifyPayload = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		if (typeof req.body.comment !== 'object')
			return res
				.status(400)
				.send(new BadRequestError('Request body is missing comment.'));
		if (!validateDateFormat(req.body.comment.date))
			return res.status(400).send(new BadRequestError('Wrong date format.'));
		if (typeof req.body.comment.content !== 'string')
			return res.status(400).send(new BadRequestError('Wrong content format.'));
		next();
	};
}
