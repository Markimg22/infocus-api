import { client } from '@/infra/helpers'
import { setupApp } from '@/main/config/app'
import { mockCreateUserParams } from '@/tests/domain/mocks'
import { env } from '@/main/config/env'

import { Express } from 'express'
import { sign } from 'jsonwebtoken'
import request from 'supertest'

let app: Express

const mockAccessToken = async (): Promise<string> => {
  const user = await client.users.create({
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

describe('Tasks Routes', () => {
  beforeAll(async () => {
    app = await setupApp()
    await client.$connect()
  })

  afterAll(async () => {
    await client.accessToken.deleteMany()
    await client.tasks.deleteMany()
    await client.users.deleteMany()
    await client.$disconnect()
  })

  describe('POST /create-task', () => {
    it('should return 200 on create task', async () => {
      const accessToken = await mockAccessToken()
      await request(app)
        .post('/api/create-task')
        .set('x-access-token', accessToken)
        .send({
          title: 'Title Test',
          description: 'Description Test'
        })
        .expect(200)
    })

    it('should return 403 on create task without accessToken', async () => {
      await request(app)
        .post('/api/create-task')
        .send({
          title: 'Title Test',
          description: 'Description Test'
        })
        .expect(403)
    })
  })
})
