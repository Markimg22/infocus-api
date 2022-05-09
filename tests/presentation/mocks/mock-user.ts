import {
  CreateUser,
  AuthenticationUser,
  LoadUserByToken,
} from '@/domain/usecases';

import faker from '@faker-js/faker';

export class CreateUserSpy implements CreateUser {
  result = faker.datatype.uuid();
  params = {} as CreateUser.Params;

  async create(params: CreateUser.Params): Promise<CreateUser.Result> {
    this.params = params;
    return this.result;
  }
}

export class AuthenticationUserSpy implements AuthenticationUser {
  params = {} as AuthenticationUser.Params;
  result = {
    accessToken: faker.datatype.uuid(),
    name: faker.name.findName(),
  } as AuthenticationUser.Result | null;

  async auth(
    params: AuthenticationUser.Params
  ): Promise<AuthenticationUser.Result | null> {
    this.params = params;
    return this.result;
  }
}

export class LoadUserByTokenSpy implements LoadUserByToken {
  params = {};
  result = {
    id: faker.datatype.uuid(),
  } as LoadUserByToken.Result | null;

  async load(
    params: LoadUserByToken.Params
  ): Promise<LoadUserByToken.Result | null> {
    this.params = params;
    return this.result;
  }
}
