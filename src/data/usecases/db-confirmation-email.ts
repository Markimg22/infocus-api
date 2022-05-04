import { ConfirmationEmail } from '@/domain/usecases';
import {
  CheckUserByIdRepository,
  UpdateUserEmailConfirmatedRepository,
} from '@/data/protocols/repositories';

export class DbConfirmationEmail implements ConfirmationEmail {
  constructor(
    private readonly checkUserByIdRepository: CheckUserByIdRepository,
    private readonly updateUserEmailConfirmatedRepository: UpdateUserEmailConfirmatedRepository
  ) {}

  async confirm(code: string): Promise<ConfirmationEmail.Result> {
    const userExists = await this.checkUserByIdRepository.load(code);
    if (userExists) {
      const emailConfirmatedIsUpdated =
        await this.updateUserEmailConfirmatedRepository.update({
          id: code,
          emailConfirmated: true,
        });
      if (emailConfirmatedIsUpdated) {
        return {
          message: 'E-mail successfully confirmed.',
        };
      }
    }
    return {
      message: 'The email has not been confirmed.',
    };
  }
}
