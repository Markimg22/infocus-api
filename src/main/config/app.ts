import { setupMiddlewares } from '@/main/config/middlewares'

import express, { Express } from 'express'

export const setupApp = async (): Promise<Express> => {
  const app = express()
  setupMiddlewares(app)
  return app
}
