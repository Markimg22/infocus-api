import { Validation, HttpResponse, Controller } from '@/presentation/protocols';
import { MissingParamError } from '@/presentation/errors';
import { badRequest, serverError } from '@/presentation/helpers';

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
      await this.confirmationEmail.confirm(request.confirmationCode);
      return {} as HttpResponse;
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
  confirm: (code: string) => Promise<void>;
}

class ConfirmationEmailSpy implements ConfirmationEmail {
  confirmationCode = '';

  async confirm(code: string): Promise<void> {
    this.confirmationCode = code;
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
});
