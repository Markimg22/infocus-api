import { EmailValidator } from '@/utils/protocols'

export class EmailValidatorSpy implements EmailValidator {
  isEmailValid = true
  email = ''

  isValid(email: string): boolean {
    this.email = email
    return this.isEmailValid
  }
}
