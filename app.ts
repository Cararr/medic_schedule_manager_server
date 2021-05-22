import express from 'express';
import morgan from 'morgan';
import { createConnection, getConnectionOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { createExpressServer } from 'routing-controllers';
import { logger } from './source/infrastructure/logger';
import { employeesRouter } from './source/application/routes/employeesRouter';
import { workStageSpanRouter } from './source/application/routes/workStageSpansRouter';
import { schedulesRouter } from './source/application/routes/schedulesRouter';
import { PORT } from './configs/config.json';
const server = createExpressServer({
	// controllers:[],
	cors: true,
});

server.use(express.json());
server.use(morgan('dev'));

server.use(employeesRouter, workStageSpanRouter, schedulesRouter);

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
