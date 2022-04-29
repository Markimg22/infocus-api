import { Validation } from '@/presentation/protocols';
import {
  RequiredFieldValidation,
  ValidationComposite,
} from '@/utils/validation';

export const makeCreateTaskValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ['title']) {
    validations.push(new RequiredFieldValidation(field));
  }
  return new ValidationComposite(validations);
};
