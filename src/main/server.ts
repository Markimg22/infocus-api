import { setupApp } from '@/main/config/app'
import { client } from '@/infra/helpers'
import { env } from '@/main/config/env'

client.$connect()
  .then(async () => {
    console.log('📦 Connected to database.')
    const app = await setupApp()
    app.listen(env.port, () => console.log(`🔥 Server running in http://localhost:${env.port}`))
  })
  .catch(console.error)
