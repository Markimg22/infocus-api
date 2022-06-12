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
    const userExists = await this.checkUserByIdRepository.check(code);
    let emailConfirmatedIsUpdated = false;
    if (userExists) {
      emailConfirmatedIsUpdated =
        await this.updateUserEmailConfirmatedRepository.update({
          id: code,
          emailConfirmated: true,
        });
    }
    return emailConfirmatedIsUpdated;
  }
}
