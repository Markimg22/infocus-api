import { CreateTaskRespository, LoadTasksRepository, UpdateStatusTaskRepository } from '@/data/protocols/repositories'

import faker from '@faker-js/faker'

export class CreateTaskRespositorySpy implements CreateTaskRespository {
  params = {}

  async create(data: CreateTaskRespository.Params): Promise<CreateTaskRespository.Result> {
    this.params = data
  }
}

export class LoadTasksRepositorySpy implements LoadTasksRepository {
  userId = ''
  result = [{
    id: faker.datatype.uuid(),
    title: faker.random.word(),
    description: faker.random.word()
  }] as LoadTasksRepository.Result

  async load(userId: string): Promise<LoadTasksRepository.Result> {
    this.userId = userId
    return this.result
  }
}

export class UpdateStatusTaskRepositorySpy implements UpdateStatusTaskRepository {
  data = {}

  async update(data: UpdateStatusTaskRepository.Params): Promise<void> {
    this.data = data
  }
}
