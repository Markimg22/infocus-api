import { setupMiddlewares } from '@/main/config/middlewares';
import { setupRoutes } from '@/main/config/routes';
import { setupSwagger } from '@/main/config/swagger';
import { setupStaticFiles } from '@/main/config/static-files';

import express, { Express } from 'express';

export const setupApp = async (): Promise<Express> => {
  const app = express();
  setupStaticFiles(app);
  setupSwagger(app);
  setupMiddlewares(app);
  setupRoutes(app);
  return app;
};
