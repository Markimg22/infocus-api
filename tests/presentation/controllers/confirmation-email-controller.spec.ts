import { Validation } from '@/presentation/protocols';

import { ValidationSpy } from '@/tests/presentation/mocks';

import faker from '@faker-js/faker';

class ConfirmationEmailController {
  constructor(private readonly validation: Validation) {}

  async handle(request: ConfirmationEmailController.Request): Promise<void> {
    this.validation.validate(request);
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
});
