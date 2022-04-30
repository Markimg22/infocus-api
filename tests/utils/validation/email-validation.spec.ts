import { EmailValidation } from '@/utils/validation';
import { throwError } from '@/tests/domain/mocks';
import { InvalidParamError } from '@/presentation/errors';
import { EmailValidatorSpy } from '@/tests/utils/mocks';

import faker from '@faker-js/faker';

const field = faker.random.word();

type SutTypes = {
  sut: EmailValidation;
  emailValidatorSpy: EmailValidatorSpy;
};

const makeSut = (): SutTypes => {
  const emailValidatorSpy = new EmailValidatorSpy();
  const sut = new EmailValidation(field, emailValidatorSpy);
  return {
    sut,
    emailValidatorSpy,
  };
};

describe('Email Validation', () => {
  it('should return an erro if EmailValidator returns false', () => {
    const { sut, emailValidatorSpy } = makeSut();
    emailValidatorSpy.isEmailValid = false;
    const email = faker.internet.email();
    const error = sut.validate({ [field]: email });
    expect(error).toEqual(new InvalidParamError(field));
  });

  it('should call EmailValidator with correct email', () => {
    const { sut, emailValidatorSpy } = makeSut();
    const email = faker.internet.email();
    sut.validate({ [field]: email });
    expect(emailValidatorSpy.email).toBe(email);
  });

  it('should throws if EmailValidator throws', () => {
    const { sut, emailValidatorSpy } = makeSut();
    jest.spyOn(emailValidatorSpy, 'isValid').mockImplementationOnce(throwError);
    expect(sut.validate).toThrow();
  });
});
