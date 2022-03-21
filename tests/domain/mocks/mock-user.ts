import faker from '@faker-js/faker'
import { CreateUser } from '@/domain/usecases'

export const mockCreateUserParams = (): CreateUser.Params => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})
