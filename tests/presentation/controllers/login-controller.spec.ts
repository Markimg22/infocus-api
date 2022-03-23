import faker from '@faker-js/faker'
import { MissingParamError } from '@/presentation/errors'
import { badRequest, serverError } from '@/presentation/helpers'
import { ValidationSpy } from '@/tests/presentation/mocks'
import { Validation, HttpResponse } from '@/presentation/protocols'
import { AuthenticationUser } from '@/domain/usecases'
import { throwError } from '@/tests/domain/mocks'

class LoginController {
  constructor(
    private readonly validation: Validation
  ) {}

  async handle(request: LoginController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) return badRequest(error)
      return {
        statusCode: 200,
        body: {}
      }
    } catch (error) {
      return serverError(error as Error)
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

  it('should return 500 if Validation throws', async () => {
    const { sut, validationSpy } = makeSut()
    jest.spyOn(validationSpy, 'validate').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
