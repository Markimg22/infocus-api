import { Validation } from '@/presentation/protocols';
import { MissingParamError } from '@/presentation/errors';

export class RequiredFieldValidation implements Validation {
  constructor(private readonly fieldName: string) {}

  validate(input: any): Error | undefined {
    if (
      input[this.fieldName] === null ||
      input[this.fieldName] === undefined ||
      input[this.fieldName] === ''
    ) {
      return new MissingParamError(this.fieldName);
    }
    return undefined;
  }
}
