import { setupApp } from '@/main/config/app'
import { client } from '@/infra/helpers'
import { mockCreateUserParams } from '@/tests/domain/mocks'
import { env } from '@/main/config/env'

import { Users } from '@prisma/client'
import { Express } from 'express'
import request from 'supertest'
import { sign } from 'jsonwebtoken'

let app: Express
let user: Users

const mockAccessToken = async (): Promise<string> => {
  user = await client.users.create({
    data: mockCreateUserParams()
  })
  const accessToken = sign(user.id, env.jwtSecret)
  await client.accessToken.create({
    data: {
      userId: user.id,
      token: accessToken
    }
  })
  return accessToken
}

describe('Performance Routes', () => {
  beforeAll(async () => {
    app = await setupApp()
    await client.$connect()
  })

  afterAll(async () => {
    await client.accessToken.deleteMany()
    await client.users.deleteMany()
    await client.$disconnect()
  })

  describe('GET /load-performance', () => {
    it('should return 200 on load performance', async () => {
      const accessToken = await mockAccessToken()
      await request(app)
        .get('/api/load-performance')
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
