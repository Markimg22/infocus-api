import faker from '@faker-js/faker'

class DbLoadTasks {
  constructor(
    private readonly loadTasksRepository: LoadTasksRepository
  ) {}

  async loadByUserId(userId: string): Promise<void> {
    await this.loadTasksRepository.load(userId)
  }
}

interface LoadTasksRepository {
  load: (userId: string) => Promise<void>
}

class LoadTasksRepositorySpy {
  userId = ''

  async load(userId: string): Promise<void> {
    this.userId = userId
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
  it('should call LoadTasksRepository with correct usuer id', async () => {
    const { sut, loadTasksRepositorySpy } = makeSut()
    const userId = faker.datatype.uuid()
    await sut.loadByUserId(userId)
    expect(loadTasksRepositorySpy.userId).toBe(userId)
  })
})
