import {
  CreateUserRepository,
  CheckUserByEmailRepository,
  LoadUserByEmailRepository,
  LoadUserByTokenRepository,
} from '@/data/protocols/repositories';

import faker from '@faker-js/faker';

export class CheckUserByEmailRepositorySpy
  implements CheckUserByEmailRepository
{
  exists = false;
  email = '';

  async check(email: string): Promise<CheckUserByEmailRepository.Result> {
    this.email = email;
    return this.exists;
  }
}

export class CreateUserRepositorySpy implements CreateUserRepository {
  params = {};
  result = faker.datatype.uuid();

  async create(
    data: CreateUserRepository.Params
  ): Promise<CreateUserRepository.Result> {
    this.params = data;
    return this.result;
  }
}

export class LoadUserByEmailRepositorySpy implements LoadUserByEmailRepository {
  email = '';
  result = {
    id: faker.datatype.uuid(),
    name: faker.name.findName(),
    password: faker.internet.password(),
  } as LoadUserByEmailRepository.Result | null;

  async load(email: string): Promise<LoadUserByEmailRepository.Result | null> {
    this.email = email;
    return this.result;
  }
}

export class LoadUserByTokenRepositorySpy implements LoadUserByTokenRepository {
  data = {};
  result = {
    id: faker.datatype.uuid(),
  } as LoadUserByTokenRepository.Result;

  async load(
    data: LoadUserByTokenRepository.Params
  ): Promise<LoadUserByTokenRepository.Result> {
    this.data = data;
    return this.result;
  }
}
