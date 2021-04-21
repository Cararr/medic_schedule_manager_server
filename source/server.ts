import express, { Application, Request, Response, NextFunction } from 'express';
const server = express();
const PORT = process.env.PORT || 4000;

server.get('/', (req: Request, res: Response, next: NextFunction) => {
	res.send('okrr');
});

server.listen(PORT, () => {
	console.log(`CArArr on ${PORT}`);
});
