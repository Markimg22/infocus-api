import { UpdateStatusTask } from '@/domain/usecases'
import { throwError } from '@/tests/domain/mocks'

import faker from '@faker-js/faker'

class DbUpdateStatusTask {
  constructor(
    private readonly updateStatusTaskRepository: UpdateStatusTaskRepository
  ) {}

  async update(data: UpdateStatusTask.Params): Promise<void> {
    await this.updateStatusTaskRepository.update(data)
  }
}

interface UpdateStatusTaskRepository {
  update: (data: UpdateStatusTaskRepository.Params) => Promise<void>
}

namespace UpdateStatusTaskRepository {
  export type Params = UpdateStatusTask.Params
  export type Result = UpdateStatusTask.Result
}

class UpdateStatusTaskRepositorySpy implements UpdateStatusTaskRepository {
  data = {}

  async update(data: UpdateStatusTaskRepository.Params): Promise<void> {
    this.data = data
  }
}

const mockUpdateStatusTaskParams = (): UpdateStatusTask.Params => ({
  id: faker.datatype.uuid(),
  userId: faker.datatype.uuid(),
  status: true
})

type SutTypes = {
  sut: DbUpdateStatusTask,
  updateStatusTaskRepositorySpy: UpdateStatusTaskRepositorySpy
}

const makeSut = (): SutTypes => {
  const updateStatusTaskRepositorySpy = new UpdateStatusTaskRepositorySpy()
  const sut = new DbUpdateStatusTask(updateStatusTaskRepositorySpy)
  return {
    sut,
    updateStatusTaskRepositorySpy
  }
}

describe('DbUpdateStatusTask UseCase', () => {
  it('should call UpdateStatusTaskRepository with correct values', async () => {
    const { sut, updateStatusTaskRepositorySpy } = makeSut()
    const updateStatusTaskParams = mockUpdateStatusTaskParams()
    await sut.update(updateStatusTaskParams)
    expect(updateStatusTaskRepositorySpy.data).toEqual(updateStatusTaskParams)
  })

  it('should throws if UpdateStatusTaskRepository throws', async () => {
    const { sut, updateStatusTaskRepositorySpy } = makeSut()
    jest.spyOn(updateStatusTaskRepositorySpy, 'update').mockImplementationOnce(throwError)
    const promise = sut.update(mockUpdateStatusTaskParams())
    await expect(promise).rejects.toThrow()
  })
})
