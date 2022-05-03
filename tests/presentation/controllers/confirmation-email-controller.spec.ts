import { Validation, HttpResponse, Controller } from '@/presentation/protocols';
import { MissingParamError } from '@/presentation/errors';
import { badRequest, serverError, ok } from '@/presentation/helpers';

import { ValidationSpy } from '@/tests/presentation/mocks';
import { throwError } from '@/tests/domain/mocks';

import faker from '@faker-js/faker';

class ConfirmationEmailController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly confirmationEmail: ConfirmationEmail
  ) {}

  async handle(
    request: ConfirmationEmailController.Request
  ): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request);
      if (error) return badRequest(error);
      const resultConfirmated = await this.confirmationEmail.confirm(
        request.confirmationCode
      );
      return ok(resultConfirmated);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}

export namespace ConfirmationEmailController {
  export type Request = {
    confirmationCode: string;
  };
}

export interface ConfirmationEmail {
  confirm: (code: string) => Promise<ConfirmationEmail.Result>;
}

export namespace ConfirmationEmail {
  export type Result = {
    message: string;
  };
}

class ConfirmationEmailSpy implements ConfirmationEmail {
  confirmationCode = '';
  result = {
    message: 'E-mail successfully confirmed.',
  };

  async confirm(code: string): Promise<ConfirmationEmail.Result> {
    this.confirmationCode = code;
    return this.result;
  }
}

const mockRequest = (): ConfirmationEmailController.Request => ({
  confirmationCode: faker.datatype.uuid(),
});

type SutTypes = {
  sut: ConfirmationEmailController;
  validationSpy: ValidationSpy;
  confirmationEmailSpy: ConfirmationEmailSpy;
};

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy();
  const confirmationEmailSpy = new ConfirmationEmailSpy();
  const sut = new ConfirmationEmailController(
    validationSpy,
    confirmationEmailSpy
  );
  return {
    sut,
    validationSpy,
    confirmationEmailSpy,
  };
};

describe('ConfirmationEmail Controller', () => {
  it('should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut();
    const request = mockRequest();
    await sut.handle(request);
    expect(validationSpy.input).toEqual(request);
  });

  it('should return 400 if Validation return an error', async () => {
    const { sut, validationSpy } = makeSut();
    validationSpy.error = new MissingParamError(faker.random.word());
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(badRequest(validationSpy.error));
  });

  it('should return 500 if Validation throws', async () => {
    const { sut, validationSpy } = makeSut();
    jest.spyOn(validationSpy, 'validate').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should call ConfirmationEmail with correct code', async () => {
    const { sut, confirmationEmailSpy } = makeSut();
    const request = mockRequest();
    await sut.handle(request);
    expect(confirmationEmailSpy.confirmationCode).toBe(
      request.confirmationCode
    );
  });

  it('should return 500 if ConfirmationEmail throws', async () => {
    const { sut, confirmationEmailSpy } = makeSut();
    jest
      .spyOn(confirmationEmailSpy, 'confirm')
      .mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should return 200 if email successfully confirmed', async () => {
    const { sut, confirmationEmailSpy } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok(confirmationEmailSpy.result));
  });
});
