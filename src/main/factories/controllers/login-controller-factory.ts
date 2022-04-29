import { LoginController } from '@/presentation/controllers';
import { Controller } from '@/presentation/protocols';
import {
  makeDbAuthenticationUser,
  makeLoginValidation,
} from '@/main/factories';

export const makeLoginController = (): Controller => {
  const controller = new LoginController(
    makeLoginValidation(),
    makeDbAuthenticationUser()
  );
  return controller;
};
