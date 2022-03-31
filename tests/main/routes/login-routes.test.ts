import { client } from '@/infra/helpers'
import { setupApp } from '@/main/config/app'

import { Express } from 'express'
import request from 'supertest'

let app: Express

describe('Login Routes', () => {
  beforeAll(async () => {
    app = await setupApp()
    await client.$connect()
  })

  afterAll(async () => {
    await client.accessToken.deleteMany()
    await client.performance.deleteMany()
    await client.users.deleteMany()
    await client.$disconnect()
  })

  describe('POST /signup', () => {
    it('should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Teste',
          email: 'teste@mail.com',
          password: '12345',
          passwordConfirmation: '12345'
        })
        .expect(200)
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Teste',
          email: 'teste@mail.com',
          password: '12345',
          passwordConfirmation: '12345'
        })
        .expect(403)
    })
  })
})
