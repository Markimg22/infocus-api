import {
  AuthenticationUser,
  CreateUser,
  SendEmailConfirmation,
} from '@/domain/usecases';
import { Controller, Validation, HttpResponse } from '@/presentation/protocols';
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers';
import { EmailInUseError, SendEmailError } from '@/presentation/errors';

export class SignUpController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly createUser: CreateUser,
    private readonly authenticationUser: AuthenticationUser,
    private readonly sendEmailConfirmation: SendEmailConfirmation
  ) {}

  async handle(request: SignUpController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request);
      if (error) return badRequest(error);
      const { name, email, password } = request;
      const emailSent = await this.sendEmailConfirmation.send({ email, name });
      if (!emailSent) return forbidden(new SendEmailError());
      const isValid = await this.createUser.create({ name, email, password });
      if (!isValid) return forbidden(new EmailInUseError());
      const authenticationResult = await this.authenticationUser.auth({
        email,
        password,
      });
      return ok(authenticationResult);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}

export namespace SignUpController {
  export type Request = {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
  };
}
