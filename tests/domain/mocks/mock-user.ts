import { CreateUser, AuthenticationUser } from '@/domain/usecases'

import faker from '@faker-js/faker'

export const mockCreateUserParams = (): CreateUser.Params => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockAuthenticationUserParams = (): AuthenticationUser.Params => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})
