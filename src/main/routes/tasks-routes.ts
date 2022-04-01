import { adaptRoute } from '@/main/adapters'
import {
  makeCreateTaskController,
  makeLoadTasksController,
  makeUpdateStatusTaskController
} from '@/main/factories'
import { auth } from '@/main/middlewares'

import { Router } from 'express'

export default (router: Router): void => {
  router.post('/create-task', auth, adaptRoute(makeCreateTaskController()))
  router.post('/load-tasks', auth, adaptRoute(makeLoadTasksController()))
  router.put('/update-status-task', auth, adaptRoute(makeUpdateStatusTaskController()))
}
