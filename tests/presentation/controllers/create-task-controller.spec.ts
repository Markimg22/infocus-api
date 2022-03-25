import { ValidationSpy } from '@/tests/presentation/mocks'
import { Validation, HttpResponse, Controller } from '@/presentation/protocols'
import { MissingParamError } from '@/presentation/errors'
import { badRequest, serverError } from '@/presentation/helpers'
import { throwError } from '@/tests/domain/mocks'
import { CreateTask } from '@/domain/usecases'

import faker from '@faker-js/faker'

class CreateTaskController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly createTask: CreateTask,
    private readonly loadTasks: LoadTasks
  ) {}

  async handle(request: CreateTaskController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) return badRequest(error)
      await this.createTask.create(request)
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

namespace CreateTaskController {
  export type Request = {
    userId: string
    title: string,
    description: string,
    isCompleted: boolean,
  }
}

class CreateTaskSpy implements CreateTask {
  params = {}

  async create(params: CreateTask.Params): Promise<void> {
    this.params = params
  }
}

interface LoadTasks {
  loadByUserId: (userId: string) => Promise<void>
}

class LoadTasksSpy implements LoadTasks {
  userId = ''

  async loadByUserId(userId: string): Promise<void> {
    this.userId = userId
  }
}

const mockRequest = (): CreateTaskController.Request => ({
  userId: faker.datatype.uuid(),
  title: faker.random.word(),
  description: faker.random.word(),
  isCompleted: false
})

type SutTypes = {
  sut: CreateTaskController,
  validationSpy: ValidationSpy,
  createTaskSpy: CreateTaskSpy,
  loadTasksSpy: LoadTasksSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const createTaskSpy = new CreateTaskSpy()
  const loadTasksSpy = new LoadTasksSpy()
  const sut = new CreateTaskController(validationSpy, createTaskSpy, loadTasksSpy)
  return {
    sut,
    validationSpy,
    createTaskSpy,
    loadTasksSpy
  }
}

describe('CreateTask Controller', () => {
  it('should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(validationSpy.input).toEqual(request)
  })

  it('should return 400 if Validation return an error', async () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.error = new MissingParamError(faker.random.word())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(validationSpy.error))
  })

  it('should return 500 if Validation throws', async () => {
    const { sut, validationSpy } = makeSut()
    jest.spyOn(validationSpy, 'validate').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('should call CreateTask with correct values', async () => {
    const { sut, createTaskSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(createTaskSpy.params).toEqual(request)
  })

  it('should return 500 if CreateTask throws', async () => {
    const { sut, createTaskSpy } = makeSut()
    jest.spyOn(createTaskSpy, 'create').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('should call LoadTasks with correct values', async () => {
    const { sut, loadTasksSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(loadTasksSpy.userId).toEqual(request.userId)
  })
})
