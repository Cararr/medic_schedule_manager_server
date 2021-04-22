import { createExpressServer } from 'routing-controllers';
import { createConnections } from 'typeorm';
import * as config from './config.json';
import {
	Controller,
	Param,
	Body,
	Get,
	Post,
	Put,
	Delete,
} from 'routing-controllers';
@Controller()
class testController {
	@Get('/') testResponse() {
		return '<h1>DUPCA</h1>';
	}
}
createExpressServer({ controllers: [testController], cors: true }).listen(
	config.port
	/* 	() =>
		createConnections()
			.then(() => console.log(`Server listen on port: ${config.port}`))
			.catch((error) => console.error(error)) */
);
