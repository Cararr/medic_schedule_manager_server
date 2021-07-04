import express from 'express';
import { HomeRehabilitationController } from '../controllers/HomeRehabilitationController';
import validateToken from '../middleware/validateJWT';
import verifyPermissions from '../middleware/verifyPermissions';
import preloadStationsAndEmployees from '../middleware/preloadStationsAndEmployees';

export const homeRehabilitationRouter = express.Router();

homeRehabilitationRouter.get(
	'/home-rehabilitations',
	validateToken,
	HomeRehabilitationController.getHomeRehabilitationsByDate
);

homeRehabilitationRouter.post(
	'/home-rehabilitations',
	validateToken,
	verifyPermissions,
	preloadStationsAndEmployees,
	HomeRehabilitationController.createHomeRehabilitationsBodyVeryfier,
	HomeRehabilitationController.createHomeRehabilitations
);

homeRehabilitationRouter.put(
	'/home-rehabilitations/:id',
	validateToken,
	verifyPermissions,
	preloadStationsAndEmployees,
	HomeRehabilitationController.updateHomeRehabilitation
);

homeRehabilitationRouter.delete(
	'/home-rehabilitations/:id',
	validateToken,
	verifyPermissions,
	HomeRehabilitationController.deleteHomeRehabilitation
);
