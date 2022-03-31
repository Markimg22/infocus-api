import { adaptRoute } from '@/main/adapters'
import { makeSignupController } from '@/main/factories'

import { Router, Express } from 'express'

export const setupRoutes = (app: Express): void => {
  const router = Router()
  router.post('/signup', adaptRoute(makeSignupController()))
  app.use('/api', router)
}
