import {
  accountSchema,
  loginParamsSchema,
  errorSchema,
  signUpParamsSchema,
} from './schemas/';

export default {
  account: accountSchema,
  loginParams: loginParamsSchema,
  signUpParams: signUpParamsSchema,
  error: errorSchema,
};
