import faker from '@faker-js/faker'

class DeleteTaskController {
  constructor(
    private readonly deleteTask: DeleteTask
  ) {}

  async handle(request: DeleteTaskController.Request): Promise<void> {
    await this.deleteTask.delete(request)
  }
}

namespace DeleteTaskController {
  export type Request = {
    id: string,
    userId: string
  }
}

interface DeleteTask {
  delete: (params: DeleteTask.Params) => Promise<void>
}

namespace DeleteTask {
  export type Params = {
    id: string,
    userId: string
  }
}

class DeleteTaskSpy implements DeleteTask {
  params = {}

  async delete(params: DeleteTask.Params): Promise<void> {
    this.params = params
  }
}

const mockRequest = (): DeleteTaskController.Request => ({
  id: faker.datatype.uuid(),
  userId: faker.datatype.uuid()
})

type SutTypes = {
  sut: DeleteTaskController,
  deleteTaskSpy: DeleteTaskSpy
}

const makeSut = (): SutTypes => {
  const deleteTaskSpy = new DeleteTaskSpy()
  const sut = new DeleteTaskController(deleteTaskSpy)
  return {
    sut,
    deleteTaskSpy
  }
}

describe('DeleteTask Controller', () => {
  it('should call DeleteTask with correct values', async () => {
    const { sut, deleteTaskSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(deleteTaskSpy.params).toEqual(request)
  })
})
