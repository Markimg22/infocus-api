import { ValidationSpy } from '@/tests/presentation/mocks'
import { Validation, HttpResponse } from '@/presentation/protocols'
import { MissingParamError } from '@/presentation/errors'
import { badRequest } from '@/presentation/helpers'

import faker from '@faker-js/faker'

class CreateTaskController {
  constructor(
    private readonly validation: Validation
  ) {}

  async handle(request: any): Promise<HttpResponse> {
    const error = this.validation.validate(request)
    if (error) return badRequest(error)
    return {
      statusCode: 200,
      body: {}
    }
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

  it('should return 400 if Validation return an error', async () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.error = new MissingParamError(faker.random.word())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(validationSpy.error))
  })
})
