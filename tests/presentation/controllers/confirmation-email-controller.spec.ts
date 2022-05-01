import { Validation, HttpResponse } from '@/presentation/protocols';
import { MissingParamError } from '@/presentation/errors';
import { badRequest } from '@/presentation/helpers';

import { ValidationSpy } from '@/tests/presentation/mocks';

import faker from '@faker-js/faker';

class ConfirmationEmailController {
  constructor(private readonly validation: Validation) {}

  async handle(
    request: ConfirmationEmailController.Request
  ): Promise<HttpResponse> {
    const error = this.validation.validate(request);
    if (error) return badRequest(error);
    return {} as HttpResponse;
  }
}

export namespace ConfirmationEmailController {
  export type Request = {
    confirmationCode: string;
  };
}

const mockRequest = (): ConfirmationEmailController.Request => ({
  confirmationCode: faker.datatype.uuid(),
});

type SutTypes = {
  sut: ConfirmationEmailController;
  validationSpy: ValidationSpy;
};

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy();
  const sut = new ConfirmationEmailController(validationSpy);
  return {
    sut,
    validationSpy,
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
});
