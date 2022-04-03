import { makeCreateTaskValidation } from '@/main/factories'
import { Validation } from '@/presentation/protocols'
import { RequiredFieldValidation, ValidationComposite } from '@/utils/validation'

jest.mock('@/utils/validation/validation-composite')

describe('CreateTaskValidation Factory', () => {
  it('shoul call ValidationComposite with all validations', () => {
    makeCreateTaskValidation()
    const validations: Validation[] = []
    for (const field of ['title']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
