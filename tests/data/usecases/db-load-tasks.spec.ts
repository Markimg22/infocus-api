import { DbLoadTasks } from '@/data/usecases'
import { throwError } from '@/tests/domain/mocks'
import { LoadTasksRepositorySpy } from '@/tests/data/mocks'

import faker from '@faker-js/faker'

type SutTypes = {
  sut: DbLoadTasks,
  loadTasksRepositorySpy: LoadTasksRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadTasksRepositorySpy = new LoadTasksRepositorySpy()
  const sut = new DbLoadTasks(loadTasksRepositorySpy)
  return {
    sut,
    loadTasksRepositorySpy
  }
}

describe('DbLoadTasks UseCase', () => {
  let userId: string

  beforeEach(() => {
    userId = faker.datatype.uuid()
  })

  it('should call LoadTasksRepository with correct usuer id', async () => {
    const { sut, loadTasksRepositorySpy } = makeSut()
    await sut.loadByUserId(userId)
    expect(loadTasksRepositorySpy.userId).toBe(userId)
  })

  it('should return tasks on success', async () => {
    const { sut, loadTasksRepositorySpy } = makeSut()
    const tasks = await sut.loadByUserId(userId)
    expect(tasks).toBe(loadTasksRepositorySpy.result)
  })

  it('should return empty list if LoadTasksRepository returns []', async () => {
    const { sut, loadTasksRepositorySpy } = makeSut()
    loadTasksRepositorySpy.result = []
    const tasks = await sut.loadByUserId(userId)
    expect(tasks).toEqual([])
  })

  it('should throws if LoadTasksRepository throws', async () => {
    const { sut, loadTasksRepositorySpy } = makeSut()
    jest.spyOn(loadTasksRepositorySpy, 'load').mockImplementationOnce(throwError)
    const promise = sut.loadByUserId(userId)
    await expect(promise).rejects.toThrow()
  })
})
