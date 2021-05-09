import express from 'express';
import morgan from 'morgan';
import { createConnection } from 'typeorm';
import { createExpressServer } from 'routing-controllers';
import { logger } from './source/infrastructure/logger';
import { schedulesRouter } from './source/routes/schedules';
import { employeesRouter } from './source/routes/employeesRoutes';
import { PORT } from './configs/config.json';
const server = createExpressServer({
	// controllers:[],
	cors: true,
});

server.use(express.json());
server.use(morgan('dev'));

// server.use('/schedules', schedulesRouter);
server.use('/employees', employeesRouter);

server.listen(PORT, () => {
	createConnection()
		.then(async () => {
			console.log(`Server is listening on port ${PORT}`);
		})
		.catch((error) => logger.error(error));
});
