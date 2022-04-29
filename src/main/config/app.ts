import { setupMiddlewares } from '@/main/config/middlewares';
import { setupRoutes } from '@/main/config/routes';

import express, { Express } from 'express';

export const setupApp = async (): Promise<Express> => {
  const app = express();
  setupMiddlewares(app);
  setupRoutes(app);
  return app;
};
