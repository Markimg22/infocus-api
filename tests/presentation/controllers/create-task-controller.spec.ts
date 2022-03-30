import { CreateTaskController } from '@/presentation/controllers'
import { ValidationSpy, CreateTaskSpy, LoadTasksSpy } from '@/tests/presentation/mocks'
import { MissingParamError } from '@/presentation/errors'
import { badRequest, serverError, ok } from '@/presentation/helpers'
import { throwError } from '@/tests/domain/mocks'

import faker from '@faker-js/faker'

const mockRequest = (): CreateTaskController.Request => ({
  userId: faker.datatype.uuid(),
  title: faker.random.word(),
  description: faker.random.word(),
  finished: false
})

type SutTypes = {
  sut: CreateTaskController,
  validationSpy: ValidationSpy,
  createTaskSpy: CreateTaskSpy,
  loadTasksSpy: LoadTasksSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const createTaskSpy = new CreateTaskSpy()
  const loadTasksSpy = new LoadTasksSpy()
  const sut = new CreateTaskController(validationSpy, createTaskSpy, loadTasksSpy)
  return {
    sut,
    validationSpy,
    createTaskSpy,
    loadTasksSpy
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

  it('should return 500 if Validation throws', async () => {
    const { sut, validationSpy } = makeSut()
    jest.spyOn(validationSpy, 'validate').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('should call CreateTask with correct values', async () => {
    const { sut, createTaskSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(createTaskSpy.params).toEqual(request)
  })

  it('should return 500 if CreateTask throws', async () => {
    const { sut, createTaskSpy } = makeSut()
    jest.spyOn(createTaskSpy, 'create').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('should call LoadTasks with correct values', async () => {
    const { sut, loadTasksSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(loadTasksSpy.userId).toEqual(request.userId)
  })

  it('should return 500 if LoadTasks throws', async () => {
    const { sut, loadTasksSpy } = makeSut()
    jest.spyOn(loadTasksSpy, 'loadByUserId').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('should return 200 if valid credentials are provided', async () => {
    const { sut, loadTasksSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(loadTasksSpy.result))
  })
})
