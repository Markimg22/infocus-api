import { DbConfirmationEmail } from '@/data/usecases';
import { ConfirmationEmail } from '@/domain/usecases';
import { makeRepositories } from '@/main/factories';

export const makeDbConfirmationEmail = (): ConfirmationEmail => {
  const { checkUserByIdRepository, updateUserEmailConfirmatedRepository } =
    makeRepositories();
  return new DbConfirmationEmail(
    checkUserByIdRepository,
    updateUserEmailConfirmatedRepository
  );
};
