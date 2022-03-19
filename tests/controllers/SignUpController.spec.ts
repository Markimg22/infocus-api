import { SignUpController } from '@/controllers'
import { CreateUser, Validation } from '@/types'
import { Authentication } from '@/types/Authentication'

import faker from '@faker-js/faker'

class ValidationSpy implements Validation {
  // @ts-expect-error
  error: Error = null
  input = {}

  validate(input: any): Error {
    this.input = input
    return this.error
  }
}

class CreateUserSpy implements CreateUser {
  result = true
  params = {} as CreateUser.Params

  async create(params: CreateUser.Params): Promise<CreateUser.Result> {
    this.params = params
    return this.result
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
