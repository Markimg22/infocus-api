import { LoadTasks } from '@/domain/usecases'
import faker from '@faker-js/faker'

class DbLoadTasks {
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

class LoadTasksRepositorySpy {
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
})
