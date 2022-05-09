import { SendEmailConfirmation } from '@/domain/usecases';
import { MailProvider } from '@/data/protocols/mail';

import faker from '@faker-js/faker';

export const mockMailOptions = (): MailProvider.Options => ({
  host: faker.internet.url(),
  port: faker.datatype.number(),
  username: faker.internet.userName(),
  password: faker.internet.password(),
  from: faker.internet.email(),
  to: faker.internet.email(),
  subject: faker.random.word(),
  text: faker.random.word(),
  html: faker.random.word(),
});

export const mockSendEmailConfirmationParams =
  (): SendEmailConfirmation.Params => ({
    id: faker.datatype.uuid(),
    email: faker.internet.email(),
    name: faker.name.findName(),
  });
