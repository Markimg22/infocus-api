import { DbCreateTask } from '@/data/usecases'
import { throwError, mockCreateTaskParams } from '@/tests/domain/mocks'
import { CreateTaskRespositorySpy } from '@/tests/data/mocks'
import faker from '@faker-js/faker'

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
    const createTaskParams = mockCreateTaskParams(faker.datatype.uuid())
    await sut.create(createTaskParams)
    expect(createTaskRespositorySpy.params).toEqual(createTaskParams)
  })

  it('should throws if CreateTaskRespository throws', async () => {
    const { sut, createTaskRespositorySpy } = makeSut()
    jest.spyOn(createTaskRespositorySpy, 'create').mockImplementationOnce(throwError)
    const promise = sut.create(mockCreateTaskParams(faker.datatype.uuid()))
    await expect(promise).rejects.toThrow()
  })
})
