import { adaptRoute } from '@/main/adapters';
import {
  makeSignupController,
  makeLoginController,
  makeConfirmationEmailController,
} from '@/main/factories';

import { Router } from 'express';

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignupController()));
  router.post('/login', adaptRoute(makeLoginController()));
  router.get(
    '/confirmation-email/:confirmationCode',
    adaptRoute(makeConfirmationEmailController())
  );
};
