import express from 'express';
import morgan from 'morgan';
import { createConnection } from 'typeorm';
import { createExpressServer } from 'routing-controllers';
import { logger } from './source/infrastructure/logger';
import { employeesRouter } from './source/routes/employeesRouter';
import { workStageSpanRouter } from './source/routes/workStageSpansRouter';
import { schedulesRouter } from './source/routes/schedulesRouter';
import { PORT } from './configs/config.json';
const server = createExpressServer({
	// controllers:[],
	cors: true,
});

server.use(express.json());
server.use(morgan('dev'));

server.use(employeesRouter, workStageSpanRouter, schedulesRouter);

server.listen(PORT, () => {
	createConnection()
		.then(async () => {
			console.log(`Server is listening on port ${PORT}`);
		})
		.catch((error) => logger.error(error));
});
