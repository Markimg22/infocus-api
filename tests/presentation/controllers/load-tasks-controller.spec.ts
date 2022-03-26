import { LoadTasks } from '@/domain/usecases'
import { LoadTasksSpy } from '@/tests/presentation/mocks'
import faker from '@faker-js/faker'

class LoadTasksController {
  constructor(
    private readonly loadTasks: LoadTasks
  ) {}

  async handle(request: LoadTasksController.Request): Promise<void> {
    await this.loadTasks.loadByUserId(request.userId)
  }
}

namespace LoadTasksController {
  export type Request = {
    userId: string
  }
}

const mockRequest = (): LoadTasksController.Request => ({
  userId: faker.datatype.uuid()
})

type SutTypes = {
  sut: LoadTasksController,
  loadTasksSpy: LoadTasksSpy
}

const makeSut = (): SutTypes => {
  const loadTasksSpy = new LoadTasksSpy()
  const sut = new LoadTasksController(loadTasksSpy)
  return {
    sut,
    loadTasksSpy
  }
}

describe('LoadTasks Controller', () => {
  it('should call LoadTasks with correct userId', async () => {
    const { sut, loadTasksSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(loadTasksSpy.userId).toBe(request.userId)
  })
})
