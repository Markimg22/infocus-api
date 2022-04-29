import { CreateAccessTokenRepository } from '@/data/protocols/repositories';

import faker from '@faker-js/faker';

export const mockCreateAccessTokenParams = (
  userId: string
): CreateAccessTokenRepository.Params => ({
  token: faker.datatype.uuid(),
  userId,
});
