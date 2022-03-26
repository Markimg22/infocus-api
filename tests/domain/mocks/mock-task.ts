import { CreateTask, UpdateStatusTask } from '@/domain/usecases'

import faker from '@faker-js/faker'

export const mockCreateTaskParams = (userId: string): CreateTask.Params => ({
  title: faker.random.word(),
  description: faker.random.word(),
  finished: false,
  userId
})

export const mockUpdateStatusTaskParams = (): UpdateStatusTask.Params => ({
  id: faker.datatype.uuid(),
  userId: faker.datatype.uuid(),
  finished: true
})
