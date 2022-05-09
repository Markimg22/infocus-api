import { DbSendEmailConfirmation } from '@/data/usecases';
import { SendEmailConfirmation } from '@/domain/usecases';
import {
  makeMailProvider,
  makeEmailConfirmationOptions,
} from '@/main/factories';

export const makeDbSendEmailConfirmation = (): SendEmailConfirmation => {
  return new DbSendEmailConfirmation(
    makeMailProvider(),
    makeEmailConfirmationOptions()
  );
};
