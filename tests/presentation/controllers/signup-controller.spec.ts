import { SignUpController } from '@/presentation/controllers';
import { EmailInUseError, SendEmailError } from '@/presentation/errors';
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers';

import {
  AuthenticationUserSpy,
  CreateUserSpy,
  ValidationSpy,
} from '@/tests/presentation/mocks';
import { throwError } from '@/tests/domain/mocks';

import faker from '@faker-js/faker';
import { SendEmailConfirmation } from '@/domain/usecases';

const mockRequest = (): SignUpController.Request => {
  const password = faker.internet.password();
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password,
    passwordConfirmation: password,
  };
};

class SendEmailConfirmationSpy implements SendEmailConfirmation {
  params = {};
  result = true;

  async send(params: SendEmailConfirmation.Params): Promise<boolean> {
    this.params = params;
    return this.result;
  }
}

type SutTypes = {
  sut: SignUpController;
  validationSpy: ValidationSpy;
  createUserSpy: CreateUserSpy;
  authenticationUserSpy: AuthenticationUserSpy;
  sendEmailConfirmationSpy: SendEmailConfirmationSpy;
};

const makeSut = (): SutTypes => {
  const authenticationUserSpy = new AuthenticationUserSpy();
  const createUserSpy = new CreateUserSpy();
  const validationSpy = new ValidationSpy();
  const sendEmailConfirmationSpy = new SendEmailConfirmationSpy();
  const sut = new SignUpController(
    validationSpy,
    createUserSpy,
    authenticationUserSpy,
    sendEmailConfirmationSpy
  );
  return {
    sut,
    validationSpy,
    createUserSpy,
    authenticationUserSpy,
    sendEmailConfirmationSpy,
  };
};

describe('SignUp Controller', () => {
  it('should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut();
    validationSpy.error = new Error('');
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(badRequest(validationSpy.error));
  });

  it('should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut();
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(validationSpy.input).toEqual(httpRequest);
  });

  it('should return 200 if valid data is provided', async () => {
    const { sut, authenticationUserSpy } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok(authenticationUserSpy.result));
  });

  it('should return 403 if CreateUser returns false', async () => {
    const { sut, createUserSpy } = makeSut();
    createUserSpy.result = '';
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()));
  });

  it('should call CreateUser with correct values', async () => {
    const { sut, createUserSpy } = makeSut();
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(createUserSpy.params).toEqual({
      name: httpRequest.name,
      email: httpRequest.email,
      password: httpRequest.password,
    });
  });

  it('should return 500 if CreateUser throws', async () => {
    const { sut, createUserSpy } = makeSut();
    jest.spyOn(createUserSpy, 'create').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should call AuthenticationUser with correct values', async () => {
    const { sut, authenticationUserSpy } = makeSut();
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(authenticationUserSpy.params).toEqual({
      email: httpRequest.email,
      password: httpRequest.password,
    });
  });

  it('should return 500 if AuthenticationUser throws', async () => {
    const { sut, authenticationUserSpy } = makeSut();
    jest
      .spyOn(authenticationUserSpy, 'auth')
      .mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should call SendEmailConfirmation with correct values', async () => {
    const { sut, sendEmailConfirmationSpy, createUserSpy } = makeSut();
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(sendEmailConfirmationSpy.params).toEqual({
      name: httpRequest.name,
      email: httpRequest.email,
      id: createUserSpy.result,
    });
  });

  it('should return 403 if SendEmailConfirmation returns false', async () => {
    const { sut, sendEmailConfirmationSpy } = makeSut();
    sendEmailConfirmationSpy.result = false;
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(forbidden(new SendEmailError()));
  });
});
