import faker from '@faker-js/faker'

class UpdateStatusTaskController {
  constructor(
    private readonly updateStatusTask: UpdateStatusTask
  ) {}

  async handle(request: UpdateStatusTaskController.Request): Promise<void> {
    await this.updateStatusTask.update(request)
  }
}

namespace UpdateStatusTaskController {
  export type Request = {
    id: string,
    userId: string,
    status: boolean
  }
}

interface UpdateStatusTask {
  update: (params: UpdateStatusTask.Params) => Promise<void>
}

namespace UpdateStatusTask {
  export type Params = {
    id: string,
    userId: string,
    status: boolean
  }
}

class UpdateStatusTaskSpy implements UpdateStatusTask {
  params = {}

  async update(params: UpdateStatusTask.Params): Promise<void> {
    this.params = params
  }
}

const mockRequest = (): UpdateStatusTaskController.Request => ({
  id: faker.datatype.uuid(),
  userId: faker.datatype.uuid(),
  status: false
})

type SutTypes = {
  sut: UpdateStatusTaskController,
  updateStatusTaskSpy: UpdateStatusTaskSpy
}

const makeSut = (): SutTypes => {
  const updateStatusTaskSpy = new UpdateStatusTaskSpy()
  const sut = new UpdateStatusTaskController(updateStatusTaskSpy)
  return {
    sut,
    updateStatusTaskSpy
  }
}

describe('UpdateStatusTask Controller', () => {
  it('should call UpdateStatusTask with correct values', async () => {
    const { sut, updateStatusTaskSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(updateStatusTaskSpy.params).toEqual(request)
  })
})
