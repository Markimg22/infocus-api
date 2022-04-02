import { Validation } from '@/presentation/protocols'
import { RequiredFieldValidation, ValidationComposite } from '@/utils/validation'

export const makeUpdateStatusTaskValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['id', 'finished']) {
    validations.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite(validations)
}
