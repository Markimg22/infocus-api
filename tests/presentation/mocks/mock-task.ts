import { CreateTask, LoadTasks } from '@/domain/usecases'

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
    isCompleted: false
  }, {
    id: faker.datatype.uuid(),
    title: faker.random.word(),
    description: faker.random.word(),
    isCompleted: true
  }] as LoadTasks.Result[]

  async loadByUserId(userId: string): Promise<LoadTasks.Result[]> {
    this.userId = userId
    return this.result
  }
}
