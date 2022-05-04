import { PrismaCheckUserByIdRepository } from '@/infra/repositories';
import { client } from '@/infra/helpers';

import { mockCreateUserParams } from '@/tests/domain/mocks';

import { Users } from '@prisma/client';

const makeSut = (): PrismaCheckUserByIdRepository => {
  const sut = new PrismaCheckUserByIdRepository(client);
  return sut;
};

describe('PrismaCheckUserById Repository', () => {
  let user: Users;

  beforeAll(async () => {
    await client.$connect();
    user = await client.users.create({
      data: mockCreateUserParams(),
    });
  });

  afterAll(async () => {
    await client.users.deleteMany();
    await client.$disconnect();
  });

  it('should return true if find any user', async () => {
    const sut = makeSut();
    const userExists = await sut.check(user.id);
    expect(userExists).toBe(true);
  });

  it('should return false if not find user', async () => {
    const sut = makeSut();
    const userExists = await sut.check('invalid_id');
    expect(userExists).toBe(false);
  });
});
