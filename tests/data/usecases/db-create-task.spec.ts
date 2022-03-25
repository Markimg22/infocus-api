import { throwError } from '@/tests/domain/mocks'

import faker from '@faker-js/faker'

class DbCreateTask {
  constructor(
    private readonly createTaskRespository: CreateTaskRespository
  ) {}

  async create(params: CreateTask.Params): Promise<void> {
    await this.createTaskRespository.create(params)
  }
}

interface CreateTaskRespository {
  create: (params: CreateTask.Params) => Promise<void>
}

class CreateTaskRespositorySpy implements CreateTaskRespository {
  params = {}

  async create(params: CreateTask.Params): Promise<void> {
    this.params = params
  }
}

namespace CreateTask {
  export type Params = {
    title: string,
    description: string,
    isCompleted: boolean,
  }
}

const mockCreateTaskParams = (): CreateTask.Params => ({
  title: faker.random.word(),
  description: faker.random.word(),
  isCompleted: false
})

type SutTypes = {
  sut: DbCreateTask,
  createTaskRespositorySpy: CreateTaskRespositorySpy
}

const makeSut = (): SutTypes => {
  const createTaskRespositorySpy = new CreateTaskRespositorySpy()
  const sut = new DbCreateTask(createTaskRespositorySpy)
  return {
    sut,
    createTaskRespositorySpy
  }
}

describe('DbCreateTask UseCase', () => {
  it('should call CreateTaskRespository with correct values', async () => {
    const { sut, createTaskRespositorySpy } = makeSut()
    const createTaskParams = mockCreateTaskParams()
    await sut.create(createTaskParams)
    expect(createTaskRespositorySpy.params).toEqual(createTaskParams)
  })

  it('should throws if CreateTaskRespository throws', async () => {
    const { sut, createTaskRespositorySpy } = makeSut()
    jest.spyOn(createTaskRespositorySpy, 'create').mockImplementationOnce(throwError)
    const promise = sut.create(mockCreateTaskParams())
    await expect(promise).rejects.toThrow()
  })
})
