import { CreateUser } from '@/domain/usecases';
import { client } from '@/infra/helpers';
import { setupApp } from '@/main/config/app';
import { HttpStatusCode } from '@/presentation/protocols';

import { mockCreateUserParams } from '@/tests/domain/mocks';
import faker from '@faker-js/faker';

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
  });

  afterAll(async () => {
    await Promise.all([
      client.accessToken.deleteMany(),
      client.performance.deleteMany(),
    ]);
    await client.users.deleteMany();
    await client.$disconnect();
  });

  describe('POST /signup', () => {
    let fakeUser: CreateUser.Params;
    beforeAll(() => {
      fakeUser = mockCreateUserParams();
    });

    it('should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: fakeUser.name,
          email: fakeUser.email,
          password: fakeUser.password,
          passwordConfirmation: fakeUser.password,
        })
        .expect(HttpStatusCode.OK);
    });

    it('should return 403 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: fakeUser.name,
          email: fakeUser.email,
          password: fakeUser.password,
          passwordConfirmation: fakeUser.password,
        })
        .expect(HttpStatusCode.FORBIDDEN);
    });
  });

  describe('POST /login', () => {
    it('should return 200 on login', async () => {
      const password = faker.internet.password();
      const passwordHash = await hash(password, 12);
      const fakeUser = await client.users.create({
        data: {
          ...mockCreateUserParams(),
          password: passwordHash,
        },
      });
      await request(app)
        .post('/api/login')
        .send({
          email: fakeUser.email,
          password,
        })
        .expect(HttpStatusCode.OK);
    });

    it('should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'invalid_email@mail.com',
          password: 'invalid_password',
        })
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
  });

  describe('GET /confirmation-email', () => {
    beforeAll(async () => {
      user = await client.users.create({
        data: mockCreateUserParams(),
      });
    });

    it('should return 200 on confirmation email', async () => {
      await request(app)
        .get(`/api/confirmation-email/${user.id}`)
        .expect(HttpStatusCode.OK);
    });

    it('should return 404 on confirmation email', async () => {
      await request(app)
        .get('/api/confirmation-email')
        .expect(HttpStatusCode.NOT_FOUND);
    });
  });
});
