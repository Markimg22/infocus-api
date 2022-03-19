import faker from '@faker-js/faker'

class InvalidParamError extends Error {
  constructor(paramName: string) {
    super(`Invalid param: ${paramName}`)
    this.name = 'InvalidParamError'
  }
}

interface EmailValidator {
  isValid: () => boolean
}

class EmailValidatorSpy {
  isEmailValid = true

  isValid(): boolean {
    return this.isEmailValid
  }
}

class EmailValidation {
  constructor(
    private readonly emailValidator: EmailValidator
  ) {}

  validate(email: string): Error | undefined {
    const isValid = this.emailValidator.isValid()
    if (!isValid) {
      return new InvalidParamError('email')
    }
  }
}

type SutTypes = {
  sut: EmailValidation,
  emailValidatorSpy: EmailValidatorSpy
}

const makeSut = (): SutTypes => {
  const emailValidatorSpy = new EmailValidatorSpy()
  const sut = new EmailValidation(emailValidatorSpy)
  return {
    sut,
    emailValidatorSpy
  }
}

describe('Email Validation', () => {
  it('should return an erro if EmailValidator returns false', () => {
    const { sut, emailValidatorSpy } = makeSut()
    emailValidatorSpy.isEmailValid = false
    const email = faker.internet.email()
    const error = sut.validate(email)
    expect(error).toEqual(new InvalidParamError('email'))
  })
})
