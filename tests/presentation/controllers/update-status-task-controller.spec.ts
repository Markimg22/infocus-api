import { throwError } from '@/tests/domain/mocks'
import { serverError } from '@/presentation/helpers'
import { HttpResponse, Controller } from '@/presentation/protocols'
import { LoadTasksSpy } from '@/tests/presentation/mocks'
import { LoadTasks } from '@/domain/usecases'

import faker from '@faker-js/faker'

class UpdateStatusTaskController implements Controller {
  constructor(
    private readonly updateStatusTask: UpdateStatusTask,
    private readonly loadTasks: LoadTasks
  ) {}

  async handle(request: UpdateStatusTaskController.Request): Promise<HttpResponse> {
    try {
      await this.updateStatusTask.update(request)
      await this.loadTasks.loadByUserId(request.userId)
      return {
        statusCode: 200,
        body: {}
      }
    } catch (error) {
      return serverError(error as Error)
    }
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
  updateStatusTaskSpy: UpdateStatusTaskSpy,
  loadTasksSpy: LoadTasksSpy
}

const makeSut = (): SutTypes => {
  const updateStatusTaskSpy = new UpdateStatusTaskSpy()
  const loadTasksSpy = new LoadTasksSpy()
  const sut = new UpdateStatusTaskController(updateStatusTaskSpy, loadTasksSpy)
  return {
    sut,
    updateStatusTaskSpy,
    loadTasksSpy
  }
}

describe('UpdateStatusTask Controller', () => {
  it('should call UpdateStatusTask with correct values', async () => {
    const { sut, updateStatusTaskSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(updateStatusTaskSpy.params).toEqual(request)
  })

  it('should return 500 if UpdateStatusTask throws', async () => {
    const { sut, updateStatusTaskSpy } = makeSut()
    jest.spyOn(updateStatusTaskSpy, 'update').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('should call LoadTasks with correct userId', async () => {
    const { sut, loadTasksSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(loadTasksSpy.userId).toBe(request.userId)
  })

  it('should return 500 if LoadTasks throws', async () => {
    const { sut, loadTasksSpy } = makeSut()
    jest.spyOn(loadTasksSpy, 'loadByUserId').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
