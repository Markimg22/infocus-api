import { ConfirmationEmail } from '@/domain/usecases';
import {
  LoadUserByConfirmationCodeRepository,
  UpdateUserEmailConfirmatedRepository,
} from '@/data/protocols/repositories';

export class DbConfirmationEmail implements ConfirmationEmail {
  constructor(
    private readonly loadUserByConfirmationCodeRepository: LoadUserByConfirmationCodeRepository,
    private readonly updateUserEmailConfirmatedRepository: UpdateUserEmailConfirmatedRepository
  ) {}

  async confirm(code: string): Promise<ConfirmationEmail.Result> {
    const user = await this.loadUserByConfirmationCodeRepository.load(code);
    const emailConfirmatedIsUpdated =
      await this.updateUserEmailConfirmatedRepository.update({
        id: user.id,
        emailConfirmated: true,
      });
    if (emailConfirmatedIsUpdated) {
      return {
        message: 'E-mail successfully confirmed.',
      };
    }
    return {
      message: 'The email has not been confirmed.',
    };
  }
}
