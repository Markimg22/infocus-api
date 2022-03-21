import faker from '@faker-js/faker'
import { Users } from '@prisma/client'

export const mockCreateUserDatabaseParams = (): Users => ({
  id: faker.datatype.uuid(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent()
})
