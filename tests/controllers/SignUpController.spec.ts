import faker from '@faker-js/faker'

interface Controller<T = any> {
  handle: (request: T) => Promise<HttpResponse>
}

class SignUpController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly createUser: CreateUser,
    private readonly authentication: Authentication
  ) {}

  async handle(request: SignUpController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return {
          statusCode: 400
        }
      }
      const { name, email, password } = request
      const isValid = await this.createUser.create({ name, email, password })
      if (!isValid) {
        return {
          statusCode: 403
        }
      }
      await this.authentication.auth({ email, password })
      return {
        statusCode: 200
      }
    } catch (error) {
      return {
        statusCode: 500
      }
    }
  }
}

namespace SignUpController {
  export type Request = {
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
  }
}

type HttpResponse = {
  statusCode: number
}

interface Validation {
  validate: (input: any) => Error
}

class ValidationSpy implements Validation {
  // @ts-expect-error
  error: Error = null
  input = {} as Request

  validate(input: any): Error {
    this.input = input
    return this.error
  }
}

interface CreateUser {
  create: (params: CreateUser.Params) => Promise<CreateUser.Result>
}

namespace CreateUser {
  export type Params = {
    name: string,
    email: string,
    password: string,
  }

  export type Result = boolean
}

class CreateUserSpy implements CreateUser {
  result = true
  params = {} as CreateUser.Params

  async create(params: CreateUser.Params): Promise<CreateUser.Result> {
    this.params = params
    return this.result
  }
}

interface Authentication {
  auth: (params: Authentication.Params) => Promise<void>
}

namespace Authentication {
  export type Params = {
    email: string,
    password: string,
  }
}

class AuthenticationSpy implements Authentication {
  params = {} as Authentication.Params

  async auth(params: Authentication.Params): Promise<void> {
    this.params = params
  }
}

const throwError = (): never => {
  throw new Error('')
}

const mockRequest = (): SignUpController.Request => {
  const password = faker.internet.password()
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password,
    passwordConfirmation: password
  }
}

type SutTypes = {
  sut: SignUpController,
  validationSpy: ValidationSpy,
  createUserSpy: CreateUserSpy,
  authenticationSpy: AuthenticationSpy
}

const makeSut = (): SutTypes => {
  const authenticationSpy = new AuthenticationSpy()
  const createUserSpy = new CreateUserSpy()
  const validationSpy = new ValidationSpy()
  const sut = new SignUpController(validationSpy, createUserSpy, authenticationSpy)
  return {
    sut,
    validationSpy,
    createUserSpy,
    authenticationSpy
  }
}

describe('SignUp Controller', () => {
  it('should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.error = new Error('')
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse.statusCode).toBe(400)
  })

  it('should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(validationSpy.input).toEqual(httpRequest)
  })

  it('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse.statusCode).toBe(200)
  })

  it('should return 403 if CreateUser returns false', async () => {
    const { sut, createUserSpy } = makeSut()
    createUserSpy.result = false
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse.statusCode).toBe(403)
  })

  it('should call CreateUser with correct values', async () => {
    const { sut, createUserSpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(createUserSpy.params).toEqual({
      name: httpRequest.name,
      email: httpRequest.email,
      password: httpRequest.password
    })
  })

  it('should return 500 if CreateUser throws', async () => {
    const { sut, createUserSpy } = makeSut()
    jest.spyOn(createUserSpy, 'create').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse.statusCode).toBe(500)
  })

  it('should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(authenticationSpy.params).toEqual({
      email: httpRequest.email,
      password: httpRequest.password
    })
  })
})
