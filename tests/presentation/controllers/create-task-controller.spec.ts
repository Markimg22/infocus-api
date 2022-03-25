import { ValidationSpy } from '@/tests/presentation/mocks'
import { Validation } from '@/presentation/protocols'

import faker from '@faker-js/faker'

class CreateTaskController {
  constructor(
    private readonly validation: Validation
  ) {}

  async handle(request: any): Promise<void> {
    this.validation.validate(request)
  }
}

namespace CreateTaskController {
  export type Request = {
    title: string,
    description: string
  }
}

const mockRequest = (): CreateTaskController.Request => ({
  title: faker.random.word(),
  description: faker.random.word()
})

type SutTypes = {
  sut: CreateTaskController,
  validationSpy: ValidationSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const sut = new CreateTaskController(validationSpy)
  return {
    sut,
    validationSpy
  }
}

describe('CreateTask Controller', () => {
  it('should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(validationSpy.input).toEqual(request)
  })
})
