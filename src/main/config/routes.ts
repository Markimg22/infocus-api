import { adaptRoute } from '@/main/adapters'
import { makeSignupController } from '@/main/factories'

import { Router } from 'express'

export const setupRoutes = (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignupController()))
}
