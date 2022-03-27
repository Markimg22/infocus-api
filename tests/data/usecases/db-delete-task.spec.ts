import { DeleteTask } from '@/domain/usecases'

import faker from '@faker-js/faker'

class DbDeleteTask implements DeleteTask {
  constructor(
    private readonly deleteTaskRepository: DeleteTaskRepository
  ) {}

  async delete(params: DeleteTask.Params): Promise<DeleteTask.Result> {
    await this.deleteTaskRepository.delete(params)
  }
}

interface DeleteTaskRepository {
  delete: (data: DeleteTaskRepository.Params) => Promise<DeleteTaskRepository.Result>
}

namespace DeleteTaskRepository {
  export type Params = DeleteTask.Params
  export type Result = DeleteTask.Result
}

class DeleteTaskRepositorySpy implements DeleteTaskRepository {
  data = {}

  async delete(data: DeleteTaskRepository.Params): Promise<DeleteTaskRepository.Result> {
    this.data = data
  }
}

const mockDeleteTaskParams = (): DeleteTask.Params => ({
  id: faker.datatype.uuid(),
  userId: faker.datatype.uuid()
})

type SutTypes = {
  sut: DbDeleteTask,
  deleteTaskRepositorySpy: DeleteTaskRepositorySpy
}

const makeSut = (): SutTypes => {
  const deleteTaskRepositorySpy = new DeleteTaskRepositorySpy()
  const sut = new DbDeleteTask(deleteTaskRepositorySpy)
  return {
    sut,
    deleteTaskRepositorySpy
  }
}

describe('DbDeleteTask UseCase', () => {
  it('should call DeleteTaskRepository with correct values', async () => {
    const { sut, deleteTaskRepositorySpy } = makeSut()
    const deleteTaskParams = mockDeleteTaskParams()
    await sut.delete(deleteTaskParams)
    expect(deleteTaskRepositorySpy.data).toEqual(deleteTaskParams)
  })
})
