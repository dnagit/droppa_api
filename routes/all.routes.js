import baseRoute from './base.routes'
import appController from '../controllers/app.controller';
 import authMiddleware from '../middlewares/auth.middleware';
import apiRoute from './api.route';

export default (app) => {
  const router = baseRoute.Router();
  router.get('/favicon.ico', (req, res) => res.status(204));
  router.get("/", appController.index);
  app.use('/api',authMiddleware.checkAuth, apiRoute);
  return router;
};
