import { DbCreateUser } from '@/data/usecases';
import { CreateUser } from '@/domain/usecases';
import { BcryptAdapter } from '@/infra/cryptography';
import { makeRepositories } from '@/main/factories';

export const makeDbCreateUser = (): CreateUser => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const {
    checkUserByEmailRepository,
    createUserRepository,
    createPerformanceRepository,
  } = makeRepositories();
  return new DbCreateUser(
    checkUserByEmailRepository,
    bcryptAdapter,
    createUserRepository,
    createPerformanceRepository
  );
};
