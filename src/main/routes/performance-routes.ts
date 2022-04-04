import { adaptRoute } from '@/main/adapters'
import { auth } from '@/main/middlewares'
import { makeLoadPerformanceController, makeUpdatePerformanceController } from '@/main/factories'

import { Router } from 'express'

export default (router: Router): void => {
  router.get('/load-performance', auth, adaptRoute(makeLoadPerformanceController()))
  router.put('/update-performance', auth, adaptRoute(makeUpdatePerformanceController()))
}
