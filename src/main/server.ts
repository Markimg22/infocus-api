import { setupApp } from '@/main/config/app'
import { client } from '@/infra/helpers'
import { env } from '@/main/config/env'
import { logger } from '@/utils/log'

client.$connect()
  .then(async () => {
    logger.info('📦 Connected to database.')
    const app = await setupApp()
    app.listen(env.port, () => logger.info(`🔥 Server running in PORT ${env.port}`))
  })
  .catch(logger.error)
