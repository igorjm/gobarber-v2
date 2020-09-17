import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController';

const providersRouter = Router();
const providerssController = new ProvidersController();

providersRouter.use(ensureAuthenticated);

// CREATE APPOINTMENTS
providersRouter.get('/', providerssController.index);

export default providersRouter;
