import faker from '@faker-js/faker'

class SignUpController {
  constructor(
    private readonly validation: Validation
  ) {}

  async handle(request: Request): Promise<any> {
    const isValid = this.validation.validate(request)
    if (!isValid) {
      return {
        statusCode: 400
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
  validate: (input: any) => boolean
}

class ValidationSpy implements Validation {
  result = true
  params = {} as Request

  validate(input: any): boolean {
    this.params = input
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
  validationSpy: ValidationSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const sut = new SignUpController(validationSpy)
  return {
    sut,
    validationSpy
  }
}

describe('SignUp Controller', () => {
  it('should return 400 if Validation returns false', async () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.result = false
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse.statusCode).toBe(400)
  })

  it('should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(validationSpy.params).toEqual(httpRequest)
  })

  it('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse.statusCode).toBe(200)
  })
})
