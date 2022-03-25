import { CreateTask } from '@/domain/usecases'

import faker from '@faker-js/faker'

export const mockCreateTaskParams = (userId: string): CreateTask.Params => ({
  title: faker.random.word(),
  description: faker.random.word(),
  isCompleted: false,
  userId
})
