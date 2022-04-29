import { makeUpdateStatusTaskValidation } from '@/main/factories';
import { Validation } from '@/presentation/protocols';
import {
  RequiredFieldValidation,
  ValidationComposite,
} from '@/utils/validation';

jest.mock('@/utils/validation/validation-composite');

describe('UpdateStatusTaskValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    makeUpdateStatusTaskValidation();
    const validations: Validation[] = [];
    for (const field of ['id', 'finished']) {
      validations.push(new RequiredFieldValidation(field));
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
