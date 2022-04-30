import { PrismaCreateUserRepository } from '@/infra/repositories';
import { mockCreateUserParams, throwError } from '@/tests/domain/mocks';
import { client } from '@/infra/helpers';

const makeSut = (): PrismaCreateUserRepository => {
  const sut = new PrismaCreateUserRepository(client);
  return sut;
};

describe('PrismaCreateUser Repository', () => {
  beforeAll(async () => {
    await client.$connect();
  });

  afterAll(async () => {
    await client.users.deleteMany();
    await client.$disconnect();
  });

  it('should return any id if user created on success', async () => {
    const sut = makeSut();
    const userId = await sut.create(mockCreateUserParams());
    const user = await client.users.findFirst({ where: { id: userId } });
    expect(userId).toBe(user?.id);
  });

  it('should throws if client database throws', async () => {
    const sut = makeSut();
    jest.spyOn(client.users, 'create').mockImplementationOnce(throwError);
    const promise = sut.create(mockCreateUserParams());
    await expect(promise).rejects.toThrow();
  });
});
