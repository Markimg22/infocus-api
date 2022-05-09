import {
  ValidationComposite,
  RequiredFieldValidation,
} from '@/utils/validation';
import { Validation } from '@/presentation/protocols';

export const makeConfirmationEmailValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ['confirmationCode']) {
    validations.push(new RequiredFieldValidation(field));
  }
  return new ValidationComposite(validations);
};
