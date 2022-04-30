import { RequiredFieldValidation } from '@/utils/validation';
import { MissingParamError } from '@/presentation/errors';

import faker from '@faker-js/faker';

const field = faker.random.word();

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation(field);
};

describe('RequiredField Validation', () => {
  it('should return a MissingParamError if validation fails', () => {
    const sut = makeSut();
    const error = sut.validate({ invalidField: faker.random.word() });
    expect(error).toEqual(new MissingParamError(field));
  });

  it('should not return if validation succeeds', () => {
    const sut = makeSut();
    const error = sut.validate({ [field]: faker.random.word() });
    expect(error).toBeFalsy();
  });
});
