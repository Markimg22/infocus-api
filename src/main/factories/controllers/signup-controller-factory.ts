import { SignUpController } from '@/presentation/controllers';
import { Controller } from '@/presentation/protocols';
import {
  makeDbCreateUser,
  makeSignUpValidation,
  makeDbAuthenticationUser,
} from '@/main/factories';

export const makeSignupController = (): Controller => {
  const controller = new SignUpController(
    makeSignUpValidation(),
    makeDbCreateUser(),
    makeDbAuthenticationUser()
  );
  return controller;
};
