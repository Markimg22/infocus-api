import {
  CheckUserByIdRepository,
  UpdateUserEmailConfirmatedRepository,
} from '@/data/protocols/repositories';

import faker from '@faker-js/faker';

export class UpdateUserEmailConfirmatedRepositorySpy
  implements UpdateUserEmailConfirmatedRepository
{
  data: UpdateUserEmailConfirmatedRepository.Params = {
    id: faker.datatype.uuid(),
    emailConfirmated: true,
  };
  result = true;

  async update(
    data: UpdateUserEmailConfirmatedRepository.Params
  ): Promise<UpdateUserEmailConfirmatedRepository.Result> {
    this.data = data;
    return this.result;
  }
}

export class CheckUserByIdRepositorySpy implements CheckUserByIdRepository {
  confirmationCode = '';
  result = true;

  async check(code: string): Promise<CheckUserByIdRepository.Result> {
    this.confirmationCode = code;
    return this.result;
  }
}
