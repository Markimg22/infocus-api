import { throwError } from '@/tests/domain/mocks'
import faker from '@faker-js/faker'
import { serverError } from '@/presentation/helpers'
import { Controller, HttpResponse } from '@/presentation/protocols'

class DeleteTaskController implements Controller {
  constructor(
    private readonly deleteTask: DeleteTask
  ) {}

  async handle(request: DeleteTaskController.Request): Promise<HttpResponse> {
    try {
      await this.deleteTask.delete(request)
      return {
        statusCode: 200,
        body: {}
      }
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

  it('should return 500 if DeleteTask throws', async () => {
    const { sut, deleteTaskSpy } = makeSut()
    jest.spyOn(deleteTaskSpy, 'delete').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
