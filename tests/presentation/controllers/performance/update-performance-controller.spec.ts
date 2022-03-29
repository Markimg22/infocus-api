import { UpdatePerformanceController } from '@/presentation/controllers'
import { ok, serverError } from '@/presentation/helpers'
import { throwError } from '@/tests/domain/mocks'
import { UpdatePerformanceSpy } from '@/tests/presentation/mocks'

import faker from '@faker-js/faker'

const mockRequest = (): UpdatePerformanceController.Request => ({
  userId: faker.datatype.uuid(),
  field: 'totalRestTime',
  value: faker.datatype.number()
})

type SutTypes = {
  sut: UpdatePerformanceController,
  updatePerformanceSpy: UpdatePerformanceSpy
}

const makeSut = (): SutTypes => {
  const updatePerformanceSpy = new UpdatePerformanceSpy()
  const sut = new UpdatePerformanceController(updatePerformanceSpy)
  return {
    sut,
    updatePerformanceSpy
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

  it('should return 200 on success', async () => {
    const { sut, updatePerformanceSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(updatePerformanceSpy.result))
  })
})
