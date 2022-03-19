import { throwError } from '@/tests/domain/mocks'
import faker from '@faker-js/faker'

class InvalidParamError extends Error {
  constructor(paramName: string) {
    super(`Invalid param: ${paramName}`)
    this.name = 'InvalidParamError'
  }
}

interface EmailValidator {
  isValid: (email: string) => boolean
}

class EmailValidatorSpy implements EmailValidator {
  isEmailValid = true
  email = ''

  isValid(email: string): boolean {
    this.email = email
    return this.isEmailValid
  }
}

class EmailValidation {
  constructor(
    private readonly emailValidator: EmailValidator
  ) {}

  validate(email: string): Error | undefined {
    const isValid = this.emailValidator.isValid(email)
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
    const error = sut.validate(faker.internet.email())
    expect(error).toEqual(new InvalidParamError('email'))
  })

  it('should call EmailValidator with correct email', () => {
    const { sut, emailValidatorSpy } = makeSut()
    const email = faker.internet.email()
    sut.validate(email)
    expect(emailValidatorSpy.email).toBe(email)
  })

  it('should throws if EmailValidator throws', () => {
    const { sut, emailValidatorSpy } = makeSut()
    jest.spyOn(emailValidatorSpy, 'isValid').mockImplementationOnce(throwError)
    expect(sut.validate).toThrow()
  })
})
