import { client } from '@/infra/helpers';
import { setupApp } from '@/main/config/app';

import { mockCreateUserParams } from '@/tests/domain/mocks';

import { Users } from '@prisma/client';
import { hash } from 'bcrypt';
import { Express } from 'express';
import request from 'supertest';

jest.setTimeout(30000);

let app: Express;
let user: Users;

describe('Login Routes', () => {
  beforeAll(async () => {
    app = await setupApp();
    await client.$connect();
    user = await client.users.create({
      data: mockCreateUserParams(),
    });
  });

  beforeEach(async () => {
    await client.accessToken.deleteMany();
    await client.performance.deleteMany();
    await client.users.deleteMany();
  });

  afterAll(async () => {
    await client.$disconnect();
  });

  describe('POST /signup', () => {
    it('should return 200 and 403 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Teste',
          email: 'teste@mail.com',
          password: '12345',
          passwordConfirmation: '12345',
        })
        .expect(200);
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Teste',
          email: 'teste@mail.com',
          password: '12345',
          passwordConfirmation: '12345',
        })
        .expect(403);
    });
  });

  describe('POST /login', () => {
    it('should return 200 on login', async () => {
      const password = await hash('123', 12);
      await client.users.create({
        data: {
          name: 'Test',
          email: 'teste@mail.com',
          password,
        },
      });
      await request(app)
        .post('/api/login')
        .send({
          email: 'teste@mail.com',
          password: '123',
        })
        .expect(200);
    });

    it('should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'teste@mail.com',
          password: '123',
        })
        .expect(401);
    });
  });

  describe('GET /confirmation-email', () => {
    it('should return 200 on confirmation email', async () => {
      await request(app).get(`/api/confirmation-email/${user.id}`).expect(200);
    });

    it('should return 404 on confirmation email', async () => {
      await request(app).get('/api/confirmation-email').expect(404);
    });
  });
});
