class SignUpController {
  constructor(
    private readonly validation: Validation
  ) {}

  async handle(): Promise<any> {
    const isValid = this.validation.validate()
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

interface Validation {
  validate: () => boolean
}

class ValidationSpy implements Validation {
  result = true

  validate(): boolean {
    return this.result
  }
}

const makeSut = () => {
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
    const httpResponse = await sut.handle()
    expect(httpResponse.statusCode).toBe(400)
  })

  it('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle()
    expect(httpResponse.statusCode).toBe(200)
  })
})
