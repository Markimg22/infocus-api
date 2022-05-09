import { makeConfirmationEmailValidation } from '@/main/factories';
import { Validation } from '@/presentation/protocols';
import {
  RequiredFieldValidation,
  ValidationComposite,
} from '@/utils/validation';

jest.mock('@/utils/validation/validation-composite');

describe('ConfirmationEmailValidation Factory', () => {
  it('shoul call ValidationComposite with all validations', () => {
    makeConfirmationEmailValidation();
    const validations: Validation[] = [];
    for (const field of ['confirmationCode']) {
      validations.push(new RequiredFieldValidation(field));
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
