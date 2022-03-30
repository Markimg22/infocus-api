import { setupApp } from '@/main/config/app'

import { Express } from 'express'
import request from 'supertest'

let app: Express

describe('BodyParser Middleware', () => {
  beforeAll(async () => {
    app = await setupApp()
  })

  it('should parse body as JSON', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body)
    })
    await request(app)
      .post('/test_body_parser')
      .send({ name: 'Teste' })
      .expect({ name: 'Teste' })
  })
})
