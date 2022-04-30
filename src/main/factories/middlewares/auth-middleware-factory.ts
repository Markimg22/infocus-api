import { AuthMiddleware } from '@/presentation/middlewares';
import { Middleware } from '@/presentation/protocols';
import { makeDbLoadUserByToken } from '@/main/factories';

export const makeAuthMiddleware = (): Middleware => {
  return new AuthMiddleware(makeDbLoadUserByToken());
};
