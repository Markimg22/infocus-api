import { SignUpController } from '@/presentation/controllers';
import { Controller } from '@/presentation/protocols';
import {
  makeDbCreateUser,
  makeSignUpValidation,
  makeDbAuthenticationUser,
  makeDbSendEmailConfirmation,
} from '@/main/factories';

export const makeSignupController = (): Controller => {
  const controller = new SignUpController(
    makeSignUpValidation(),
    makeDbCreateUser(),
    makeDbAuthenticationUser(),
    makeDbSendEmailConfirmation()
  );
  return controller;
};
