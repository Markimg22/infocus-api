import {
  CreateTaskRepository,
  LoadTasksRepository,
  UpdateStatusTaskRepository,
  DeleteTaskRepository
} from '@/data/protocols/repositories'

import faker from '@faker-js/faker'

export class CreateTaskRepositorySpy implements CreateTaskRepository {
  params = {}

  async create(data: CreateTaskRepository.Params): Promise<CreateTaskRepository.Result> {
    this.params = data
  }
}

export class LoadTasksRepositorySpy implements LoadTasksRepository {
  userId = ''
  result = [{
    id: faker.datatype.uuid(),
    title: faker.random.word(),
    description: faker.random.word(),
    finished: true
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

export class DeleteTaskRepositorySpy implements DeleteTaskRepository {
  data = {}

  async delete(data: DeleteTaskRepository.Params): Promise<DeleteTaskRepository.Result> {
    this.data = data
  }
}
