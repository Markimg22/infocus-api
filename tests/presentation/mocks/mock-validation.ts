import { Validation } from '@/presentation/protocols'

export class ValidationSpy implements Validation {
  // @ts-expect-error
  error: Error = null
  input = {}

  validate(input: any): Error {
    this.input = input
    return this.error
  }
}
