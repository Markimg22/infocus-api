import { DbUpdatePerformance } from '@/data/usecases'
import { mockUpdatePerformanceParams, throwError } from '@/tests/domain/mocks'
import { UpdatePerformanceRepositorySpy } from '@/tests/data/mocks'

type SutTypes = {
  sut: DbUpdatePerformance,
  updatePerformanceRepositorySpy: UpdatePerformanceRepositorySpy
}

const makeSut = (): SutTypes => {
  const updatePerformanceRepositorySpy = new UpdatePerformanceRepositorySpy()
  const sut = new DbUpdatePerformance(updatePerformanceRepositorySpy)
  return {
    sut,
    updatePerformanceRepositorySpy
  }
}

describe('DbUpdatePerformance UseCase', () => {
  it('should call UpdatePerformanceRepository with correct values', async () => {
    const { sut, updatePerformanceRepositorySpy } = makeSut()
    const updatePerformanceParams = mockUpdatePerformanceParams('any_id')
    await sut.update(updatePerformanceParams)
    expect(updatePerformanceRepositorySpy.data).toEqual(updatePerformanceParams)
  })

  it('should throws if UpdatePerformanceRepository throws', async () => {
    const { sut, updatePerformanceRepositorySpy } = makeSut()
    jest.spyOn(updatePerformanceRepositorySpy, 'update').mockImplementationOnce(throwError)
    const promise = sut.update(mockUpdatePerformanceParams('any_id'))
    await expect(promise).rejects.toThrow()
  })
})
