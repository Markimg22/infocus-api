import { UpdateStatusTaskController } from '@/presentation/controllers'
import { throwError } from '@/tests/domain/mocks'
import { serverError, ok, badRequest } from '@/presentation/helpers'
import { LoadTasksSpy, UpdateStatusTaskSpy, ValidationSpy } from '@/tests/presentation/mocks'
import { MissingParamError } from '@/presentation/errors'

import faker from '@faker-js/faker'

const mockRequest = (): UpdateStatusTaskController.Request => ({
  id: faker.datatype.uuid(),
  userId: faker.datatype.uuid(),
  finished: false
})

type SutTypes = {
  sut: UpdateStatusTaskController,
  updateStatusTaskSpy: UpdateStatusTaskSpy,
  loadTasksSpy: LoadTasksSpy,
  validationSpy: ValidationSpy
}

const makeSut = (): SutTypes => {
  const updateStatusTaskSpy = new UpdateStatusTaskSpy()
  const loadTasksSpy = new LoadTasksSpy()
  const validationSpy = new ValidationSpy()
  const sut = new UpdateStatusTaskController(validationSpy, updateStatusTaskSpy, loadTasksSpy)
  return {
    sut,
    updateStatusTaskSpy,
    loadTasksSpy,
    validationSpy
  }
}

describe('UpdateStatusTask Controller', () => {
  it('should call UpdateStatusTask with correct values', async () => {
    const { sut, updateStatusTaskSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(updateStatusTaskSpy.params).toEqual(request)
  })

  it('should return 500 if UpdateStatusTask throws', async () => {
    const { sut, updateStatusTaskSpy } = makeSut()
    jest.spyOn(updateStatusTaskSpy, 'update').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('should call LoadTasks with correct userId', async () => {
    const { sut, loadTasksSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(loadTasksSpy.userId).toBe(request.userId)
  })

  it('should return 500 if LoadTasks throws', async () => {
    const { sut, loadTasksSpy } = makeSut()
    jest.spyOn(loadTasksSpy, 'loadByUserId').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('should return 200 on success', async () => {
    const { sut, loadTasksSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(loadTasksSpy.result))
  })

  it('should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.error = new MissingParamError(faker.random.word())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(validationSpy.error))
  })
})
