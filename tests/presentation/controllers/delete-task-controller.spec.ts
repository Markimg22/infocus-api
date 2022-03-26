import { throwError } from '@/tests/domain/mocks'
import faker from '@faker-js/faker'
import { serverError, ok } from '@/presentation/helpers'
import { Controller, HttpResponse } from '@/presentation/protocols'
import { LoadTasks } from '@/domain/usecases'
import { LoadTasksSpy } from '@/tests/presentation/mocks'

class DeleteTaskController implements Controller {
  constructor(
    private readonly deleteTask: DeleteTask,
    private readonly loadTasks: LoadTasks
  ) {}

  async handle(request: DeleteTaskController.Request): Promise<HttpResponse> {
    try {
      await this.deleteTask.delete(request)
      const tasks = await this.loadTasks.loadByUserId(request.userId)
      return ok(tasks)
    } catch (error) {
      return serverError(error as Error)
    }
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
  deleteTaskSpy: DeleteTaskSpy,
  loadTasksSpy: LoadTasksSpy
}

const makeSut = (): SutTypes => {
  const deleteTaskSpy = new DeleteTaskSpy()
  const loadTasksSpy = new LoadTasksSpy()
  const sut = new DeleteTaskController(deleteTaskSpy, loadTasksSpy)
  return {
    sut,
    deleteTaskSpy,
    loadTasksSpy
  }
}

describe('DeleteTask Controller', () => {
  it('should call DeleteTask with correct values', async () => {
    const { sut, deleteTaskSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(deleteTaskSpy.params).toEqual(request)
  })

  it('should return 500 if DeleteTask throws', async () => {
    const { sut, deleteTaskSpy } = makeSut()
    jest.spyOn(deleteTaskSpy, 'delete').mockImplementationOnce(throwError)
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

  it('should return 200 on success', async () => {
    const { sut, loadTasksSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(loadTasksSpy.result))
  })
})
