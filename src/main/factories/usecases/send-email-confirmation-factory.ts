import { DbSendEmailConfirmation } from '@/data/usecases';
import { SendEmailConfirmation } from '@/domain/usecases';
import {
  makeMailProvider,
  makeEmailConfirmationOptions,
} from '@/main/factories/mail';

export const makeDbSendEmailConfirmation = (): SendEmailConfirmation => {
  return new DbSendEmailConfirmation(
    makeMailProvider(),
    makeEmailConfirmationOptions()
  );
};
