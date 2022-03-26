import { LoadTasks } from '@/domain/usecases'
import { throwError } from '@/tests/domain/mocks'
import { LoadTasksSpy } from '@/tests/presentation/mocks'
import { serverError, ok } from '@/presentation/helpers'
import { Controller, HttpResponse } from '@/presentation/protocols'

import faker from '@faker-js/faker'

class LoadTasksController implements Controller {
  constructor(
    private readonly loadTasks: LoadTasks
  ) {}

  async handle(request: LoadTasksController.Request): Promise<HttpResponse> {
    try {
      const tasks = await this.loadTasks.loadByUserId(request.userId)
      return ok(tasks)
    } catch (error) {
      return serverError(error as Error)
    }
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
