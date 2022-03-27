import { LoadPerformanceController } from '@/presentation/controllers'
import { ok, serverError } from '@/presentation/helpers'
import { throwError } from '@/tests/domain/mocks'
import { LoadPerformanceSpy } from '@/tests/presentation/mocks'

import faker from '@faker-js/faker'

const mockRequest = (): LoadPerformanceController.Request => ({
  userId: faker.datatype.uuid()
})

type SutTypes = {
  sut: LoadPerformanceController,
  loadPerformanceSpy: LoadPerformanceSpy
}

const makeSut = (): SutTypes => {
  const loadPerformanceSpy = new LoadPerformanceSpy()
  const sut = new LoadPerformanceController(loadPerformanceSpy)
  return {
    sut,
    loadPerformanceSpy
  }
}

describe('LoadPerformance Controller', () => {
  it('should call LoadPerformance with correct userId', async () => {
    const { sut, loadPerformanceSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(loadPerformanceSpy.userId).toBe(request.userId)
  })

  it('should return 500 if LoadPerformance throws', async () => {
    const { sut, loadPerformanceSpy } = makeSut()
    jest.spyOn(loadPerformanceSpy, 'loadByUserId').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('should return 200 on success', async () => {
    const { sut, loadPerformanceSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(loadPerformanceSpy.result))
  })
})
