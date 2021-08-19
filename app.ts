import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { createConnection, getConnectionOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { createExpressServer } from 'routing-controllers';
import { logger } from './source/infrastructure/logger';
import { loginRouter } from './source/application/routes/loginRouter';
import { employeeRouter } from './source/application/routes/employeeRouter';
import { workStageSpanRouter } from './source/application/routes/workStageSpanRouter';
import { scheduleRouter } from './source/application/routes/scheduleRouter';
import { homeRehabilitationRouter } from './source/application/routes/homeRehabilitationRouter';
import { commentRouter } from './source/application/routes/commentRouter';
import { vacationRouter } from './source/application/routes/vacationRouter';
import dotenv from 'dotenv';

dotenv.config();

const server = createExpressServer({
	// controllers:[],
	// cors: true,
});

server.use(express.json(), morgan('dev'), cookieParser());

server.use(
	'/api',
	loginRouter,
	employeeRouter,
	workStageSpanRouter,
	homeRehabilitationRouter,
	scheduleRouter,
	commentRouter,
	vacationRouter
);

const PORT = process.env.PORT || 4000;

server.listen(PORT, async () => {
	const connectionOptions = await getConnectionOptions();
	Object.assign(connectionOptions, {
		namingStrategy: new SnakeNamingStrategy(),
	});
	try {
		await createConnection(connectionOptions);
		console.log(`Server is listening on port ${PORT}`);
	} catch (error) {
		logger.error(error);
	}
});
