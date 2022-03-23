import faker from '@faker-js/faker'
import { MissingParamError } from '@/presentation/errors'
import { badRequest } from '@/presentation/helpers'
import { ValidationSpy } from '@/tests/presentation/mocks'
import { Validation, HttpResponse } from '@/presentation/protocols'
import { AuthenticationUser } from '@/domain/usecases'

class LoginController {
  constructor(
    private readonly validation: Validation
  ) {}

  async handle(request: LoginController.Request): Promise<HttpResponse> {
    const error = this.validation.validate(request)
    if (error) return badRequest(error)
    return {
      statusCode: 200,
      body: {}
    }
  }
}

namespace LoginController {
  export type Request = {
    email: string,
    password: string
  }
}

const mockRequest = (): AuthenticationUser.Params => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})

type SutTypes = {
  sut: LoginController,
  validationSpy: ValidationSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const sut = new LoginController(validationSpy)
  return {
    sut,
    validationSpy
  }
}

describe('Login Controller', () => {
  it('return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.error = new MissingParamError(faker.random.word())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(validationSpy.error))
  })

  it('should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(validationSpy.input).toEqual(request)
  })
})
