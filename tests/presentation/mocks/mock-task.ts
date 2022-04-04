import { CreateTask, DeleteTask, LoadTasks, UpdateStatusTask } from '@/domain/usecases'

import faker from '@faker-js/faker'

export class CreateTaskSpy implements CreateTask {
  params = {}

  async create(params: CreateTask.Params): Promise<CreateTask.Result> {
    this.params = params
  }
}

export class LoadTasksSpy implements LoadTasks {
  userId = ''
  result = [{
    id: faker.datatype.uuid(),
    title: faker.random.word(),
    description: faker.random.word(),
    finished: false
  }, {
    id: faker.datatype.uuid(),
    title: faker.random.word(),
    description: faker.random.word(),
    finished: true
  }] as LoadTasks.Result[]

  async loadByUserId(userId: string): Promise<LoadTasks.Result[]> {
    this.userId = userId
    return this.result
  }
}

export class UpdateStatusTaskSpy implements UpdateStatusTask {
  params = {} as UpdateStatusTask.Params
  result = true

  async update(params: UpdateStatusTask.Params): Promise<UpdateStatusTask.Result> {
    this.params = params
    return this.result
  }
}

export class DeleteTaskSpy implements DeleteTask {
  params = {}
  result = true

  async delete(params: DeleteTask.Params): Promise<DeleteTask.Result> {
    this.params = params
    return this.result
  }
}
