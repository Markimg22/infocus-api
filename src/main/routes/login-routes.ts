import { adaptRoute } from '@/main/adapters';
import { makeSignupController, makeLoginController } from '@/main/factories';

import { Router } from 'express';

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignupController()));
  router.post('/login', adaptRoute(makeLoginController()));
};
