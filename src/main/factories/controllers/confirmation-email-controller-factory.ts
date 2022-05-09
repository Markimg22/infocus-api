import { ConfirmationEmailController } from '@/presentation/controllers';
import { Controller } from '@/presentation/protocols';
import {
  makeConfirmationEmailValidation,
  makeDbConfirmationEmail,
} from '@/main/factories';

export const makeConfirmationEmailController = (): Controller => {
  const controller = new ConfirmationEmailController(
    makeConfirmationEmailValidation(),
    makeDbConfirmationEmail()
  );
  return controller;
};
