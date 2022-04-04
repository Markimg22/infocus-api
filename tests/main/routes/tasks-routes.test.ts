import { client } from '@/infra/helpers'
import { setupApp } from '@/main/config/app'
import { mockCreatePerformanceParams, mockCreateTaskParams, mockCreateUserParams } from '@/tests/domain/mocks'
import { env } from '@/main/config/env'

import { Express } from 'express'
import { sign } from 'jsonwebtoken'
import request from 'supertest'
import { Users } from '@prisma/client'

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

describe('Tasks Routes', () => {
  beforeAll(async () => {
    app = await setupApp()
    await client.$connect()
  })

  afterEach(async () => {
    await client.tasks.deleteMany()
  })

  afterAll(async () => {
    await client.accessToken.deleteMany()
    await client.performance.deleteMany()
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

  describe('GET /load-tasks', () => {
    it('should return 200 on load tasks', async () => {
      const accessToken = await mockAccessToken()
      await request(app)
        .get('/api/load-tasks')
        .set('x-access-token', accessToken)
        .expect(200)
    })

    it('should return 403 on load tasks without accessToken', async () => {
      await request(app)
        .get('/api/load-tasks')
        .expect(403)
    })
  })

  describe('PUT /update-status-task', () => {
    it('should return 200 on update status task', async () => {
      const accessToken = await mockAccessToken()
      await client.tasks.create({
        data: mockCreateTaskParams(user.id)
      })
      const tasks = await client.tasks.findMany({
        where: { userId: user.id }
      })
      await client.performance.create({
        data: mockCreatePerformanceParams(user.id)
      })
      await request(app)
        .put('/api/update-status-task')
        .send({
          id: tasks[0].id,
          finished: true
        })
        .set('x-access-token', accessToken)
        .expect(200)
    })

    it('should return 403 if task not found', async () => {
      const accessToken = await mockAccessToken()
      await request(app)
        .put('/api/update-status-task')
        .send({
          id: 'invalid_task_id',
          finished: true
        })
        .set('x-access-token', accessToken)
        .expect(403)
    })

    it('should return 403 on update status task without accessToken', async () => {
      await request(app)
        .put('/api/update-status-task')
        .expect(403)
    })

    it('should return 400 if update with invalid body', async () => {
      const accessToken = await mockAccessToken()
      await request(app)
        .put('/api/update-status-task')
        .set('x-access-token', accessToken)
        .expect(400)
    })
  })

  describe('DELETE /delete-task', () => {
    it('should return 200 on delete task succeds', async () => {
      const accessToken = await mockAccessToken()
      await client.tasks.create({
        data: mockCreateTaskParams(user.id)
      })
      const tasks = await client.tasks.findMany({
        where: { userId: user.id }
      })
      await request(app)
        .delete('/api/delete-task')
        .set('x-access-token', accessToken)
        .send({
          id: tasks[0].id
        })
        .expect(200)
    })

    it('should return 403 if task not found', async () => {
      const accessToken = await mockAccessToken()
      await request(app)
        .delete('/api/delete-task')
        .set('x-access-token', accessToken)
        .send({
          id: 'any_id'
        })
        .expect(403)
    })

    it('should return 403 on delete task without accessToken', async () => {
      await request(app)
        .delete('/api/delete-task')
        .send({
          id: 'any_id'
        })
        .expect(403)
    })
  })
})
