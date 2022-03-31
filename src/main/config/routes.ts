import { adaptRoute } from '@/main/adapters'
import { makeSignupController, makeLoginController } from '@/main/factories'

import { Router, Express } from 'express'

export const setupRoutes = (app: Express): void => {
  const router = Router()
  router.post('/signup', adaptRoute(makeSignupController()))
  router.post('/login', adaptRoute(makeLoginController()))
  app.use('/api', router)
}
