import { Validation, HttpResponse, Controller } from '@/presentation/protocols';
import { badRequest, serverError, ok, notFound } from '@/presentation/helpers';
import { ConfirmationEmail } from '@/domain/usecases';

export class ConfirmationEmailController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly confirmationEmail: ConfirmationEmail
  ) {}

  async handle(
    request: ConfirmationEmailController.Request
  ): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request);
      if (error) return badRequest(error);
      const resultConfirmated = await this.confirmationEmail.confirm(
        request.confirmationCode
      );
      if (!resultConfirmated) return notFound();
      return ok(resultConfirmated);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}

export namespace ConfirmationEmailController {
  export type Request = {
    confirmationCode: string;
  };
}
