import { LoadTasks } from '@/domain/usecases'
import { throwError } from '@/tests/domain/mocks'

import faker from '@faker-js/faker'

class DbLoadTasks implements LoadTasks {
  constructor(
    private readonly loadTasksRepository: LoadTasksRepository
  ) {}

  async loadByUserId(userId: string): Promise<LoadTasks.Result[]> {
    const tasks = await this.loadTasksRepository.load(userId)
    return tasks
  }
}

interface LoadTasksRepository {
  load: (userId: string) => Promise<LoadTasks.Result[]>
}

class LoadTasksRepositorySpy implements LoadTasksRepository {
  userId = ''
  result = [{
    id: faker.datatype.uuid(),
    title: faker.random.word(),
    description: faker.random.word()
  }] as LoadTasks.Result[]

  async load(userId: string): Promise<LoadTasks.Result[]> {
    this.userId = userId
    return this.result
  }
}

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
