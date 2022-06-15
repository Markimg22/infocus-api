import { AuthenticationUser } from '@/domain/usecases';
import {
  badRequest,
  unauthorized,
  ok,
  serverError,
} from '@/presentation/helpers';
import { Controller, HttpResponse, Validation } from '@/presentation/protocols';

export class LoginController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly authenticationUser: AuthenticationUser
  ) {}

  async handle(
    request: LoginController.Request
  ): Promise<HttpResponse<AuthenticationUser.Result>> {
    try {
      const error = this.validation.validate(request);
      if (error) return badRequest(error);
      const authenticationUserResult = await this.authenticationUser.auth(
        request
      );
      if (!authenticationUserResult) return unauthorized();
      return ok(authenticationUserResult);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}

export namespace LoginController {
  export type Request = {
    email: string;
    password: string;
  };
}
