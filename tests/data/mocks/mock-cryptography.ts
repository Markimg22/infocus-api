import { Hasher } from '@/data/protocols/cryptography'

import faker from '@faker-js/faker'

export class HasherSpy implements Hasher {
  plainText = ''
  hashedText = faker.datatype.uuid()

  async hash(plainText: string): Promise<string> {
    this.plainText = plainText
    return this.hashedText
  }
}
