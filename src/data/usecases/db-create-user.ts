import { CreateUser } from '@/domain/usecases';
import {
  CreateUserRepository,
  CheckUserByEmailRepository,
  CreatePerformanceRepository,
} from '@/data/protocols/repositories';
import { Hasher } from '@/data/protocols/cryptography';

export class DbCreateUser implements CreateUser {
  constructor(
    private readonly checkUserByEmailRepository: CheckUserByEmailRepository,
    private readonly hasher: Hasher,
    private readonly createUserRepository: CreateUserRepository,
    private readonly createPerformanceRepository: CreatePerformanceRepository
  ) {}

  async create(params: CreateUser.Params): Promise<CreateUser.Result> {
    const { name, email, password } = params;
    const userAlreadyExists = await this.checkUserByEmailRepository.check(
      email
    );
    if (userAlreadyExists) return '';
    const hashedPassword = await this.hasher.hash(password);
    const userId = await this.createUserRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    await this.createPerformanceRepository.create({ userId });
    return userId;
  }
}
