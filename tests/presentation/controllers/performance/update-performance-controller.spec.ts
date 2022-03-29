import { UpdatePerformanceController } from '@/presentation/controllers'
import { ok, serverError } from '@/presentation/helpers'
import { throwError } from '@/tests/domain/mocks'
import { UpdatePerformanceSpy, LoadPerformanceSpy } from '@/tests/presentation/mocks'

import faker from '@faker-js/faker'

const mockRequest = (): UpdatePerformanceController.Request => ({
  userId: faker.datatype.uuid(),
  field: 'totalRestTime',
  value: faker.datatype.number()
})

type SutTypes = {
  sut: UpdatePerformanceController,
  updatePerformanceSpy: UpdatePerformanceSpy,
  loadPerformanceSpy: LoadPerformanceSpy
}

const makeSut = (): SutTypes => {
  const updatePerformanceSpy = new UpdatePerformanceSpy()
  const loadPerformanceSpy = new LoadPerformanceSpy()
  const sut = new UpdatePerformanceController(updatePerformanceSpy, loadPerformanceSpy)
  return {
    sut,
    updatePerformanceSpy,
    loadPerformanceSpy
  }
}

describe('UpdatePerformance Controller', () => {
  it('should call UpdatePerformance with correct values', async () => {
    const { sut, updatePerformanceSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(updatePerformanceSpy.params).toEqual(request)
  })

  it('should return 500 if UpdatePerformance throws', async () => {
    const { sut, updatePerformanceSpy } = makeSut()
    jest.spyOn(updatePerformanceSpy, 'update').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('should call LoadPerformance with correct userId', async () => {
    const { sut, loadPerformanceSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(loadPerformanceSpy.userId).toBe(request.userId)
  })

  it('should return 200 on success', async () => {
    const { sut, loadPerformanceSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(loadPerformanceSpy.result))
  })
})
