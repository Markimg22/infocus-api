import { CreateUser } from '@/domain/usecases'
import { CreateUserRepository, CheckUserByEmailRepository } from '@/data/protocols/repositories'
import { Hasher } from '@/data/protocols/cryptography'

export class DbCreateUser implements CreateUser {
  constructor (
    private readonly checkUserByEmailRepository: CheckUserByEmailRepository,
    private readonly hasher: Hasher,
    private readonly createUserRepository: CreateUserRepository
  ) {}

  async create(params: CreateUser.Params): Promise<CreateUser.Result> {
    const { name, email, password } = params
    const userAlreadyExists = await this.checkUserByEmailRepository.check(email)
    if (userAlreadyExists) return false
    const hashedPassword = await this.hasher.hash(password)
    const userCreated = await this.createUserRepository.create({
      name,
      email,
      password: hashedPassword
    })
    return userCreated
  }
}
