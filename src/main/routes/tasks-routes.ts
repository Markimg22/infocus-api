import { adaptRoute } from '@/main/adapters'
import { makeCreateTaskController } from '@/main/factories'
import { auth } from '@/main/middlewares'

import { Router } from 'express'

export default (router: Router): void => {
  router.post('/create-task', auth, adaptRoute(makeCreateTaskController()))
}
