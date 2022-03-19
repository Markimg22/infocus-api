import faker from '@faker-js/faker'

class SignUpController {
  constructor(
    private readonly validation: Validation,
    private readonly createUserService: CreateUserService
  ) {}

  async handle(request: Request): Promise<any> {
    const error = this.validation.validate(request)
    if (error) {
      return {
        statusCode: 400
      }
    }
    const isValid = await this.createUserService.create()
    if (!isValid) {
      return {
        statusCode: 403
      }
    }
    return {
      statusCode: 200
    }
  }
}

type Request = {
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string,
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

interface CreateUserService {
  create: () => Promise<boolean>
}

class CreateUserServiceSpy implements CreateUserService {
  result = true

  async create(): Promise<boolean> {
    return this.result
  }
}

const mockRequest = (): Request => {
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
  createUserServiceSpy: CreateUserServiceSpy
}

const makeSut = (): SutTypes => {
  const createUserServiceSpy = new CreateUserServiceSpy()
  const validationSpy = new ValidationSpy()
  const sut = new SignUpController(validationSpy, createUserServiceSpy)
  return {
    sut,
    validationSpy,
    createUserServiceSpy
  }
}

describe('SignUp Controller', () => {
  it('should return 400 if Validation returns false', async () => {
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

  it('should return 403 if CreateUserService returns false', async () => {
    const { sut, createUserServiceSpy } = makeSut()
    createUserServiceSpy.result = false
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse.statusCode).toBe(403)
  })
})
