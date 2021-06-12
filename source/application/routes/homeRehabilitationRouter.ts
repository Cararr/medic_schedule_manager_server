import express from 'express';
import { HomeRehabilitationController } from '../controllers/HomeRehabilitationController';
import validateToken from '../middleware/validateJWT';
import verifyPermissions from '../middleware/verifyPermissions';
import preloadStationsAndEmployees from '../middleware/preloadStationsAndEmployees';

export const homeRehabilitationRouter = express.Router();

homeRehabilitationRouter.get(
	'/home-rehabilitaitons',
	validateToken,
	HomeRehabilitationController.getHomeRehabilitationsByDate
);

homeRehabilitationRouter.post(
	'/home-rehabilitaitons',
	validateToken,
	verifyPermissions,
	preloadStationsAndEmployees,
	HomeRehabilitationController.createHomeRehabilitationsBodyVeryfier,
	HomeRehabilitationController.createHomeRehabilitations
);

homeRehabilitationRouter.put(
	'/home-rehabilitaitons/:id',
	validateToken,
	verifyPermissions,
	preloadStationsAndEmployees,
	HomeRehabilitationController.updateHomeRehabilitation
);

homeRehabilitationRouter.delete(
	'/home-rehabilitaitons/:id',
	validateToken,
	verifyPermissions,
	HomeRehabilitationController.deleteHomeRehabilitaiton
);
